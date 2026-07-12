import { singleton } from '@/shared/di';

import { MeetingsService, MeetingsViewModel } from '@/entities/meeting';
import { ToastsViewModel } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';
import { isTauri } from '@/shared/isTauri';
import { formatSeconds } from '@/shared/lib/time';
import { SingletonViewModel } from '@/shared/view-model';

import {
  CallDetectedEvent,
  CallSource,
  RecorderService,
  StopRecordingResult,
  UploadProgressEvent,
} from './RecorderService';

export enum RecorderStatus {
  Idle = 'idle',
  /** Call detected, waiting for the user to accept or skip. */
  Prompting = 'prompting',
  Recording = 'recording',
  Uploading = 'uploading',
}

const AUTO_RECORD_KEY = 'voicer.recorder.autoRecord';
/** Maps the in-flight local recording to its server meeting across reloads. */
const PENDING_KEY = 'voicer.recorder.pending';

type PendingRecording = {
  localId: string;
  meetingId: string | null;
  source: CallSource;
};

@singleton()
export class RecorderViewModel extends SingletonViewModel {
  status = RecorderStatus.Idle;

  source: CallSource = 'other';

  autoRecord = localStorage.getItem(AUTO_RECORD_KEY) === 'true';

  elapsedSec = 0;

  uploadSent = 0;

  uploadTotal = 0;

  private meetingId: string | null = null;

  private localId: string | null = null;

  private recordingPath: string | null = null;

  private startedAtMs: number | null = null;

  /** "Skip" mutes further call-detected events until the call ends. */
  private skippedCurrentCall = false;

  private isSetup = false;

  private isStarting = false;

  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly recorder: RecorderService,
    private readonly meetingsService: MeetingsService,
    private readonly meetings: MeetingsViewModel,
    private readonly toasts: ToastsViewModel,
  ) {
    super();
  }

  get isPromptVisible() {
    return this.status === RecorderStatus.Prompting;
  }

  get isBarVisible() {
    return (
      this.status === RecorderStatus.Recording ||
      this.status === RecorderStatus.Uploading
    );
  }

  get isUploading() {
    return this.status === RecorderStatus.Uploading;
  }

  get promptMessage() {
    return this.source === 'other'
      ? i18n.t('recorder.call_detected_unknown')
      : i18n.t('recorder.call_detected', { source: this.sourceLabel ?? '' });
  }

  get sourceLabel() {
    return i18n.t(`recorder.source.${this.source}`);
  }

  get barText() {
    return this.isUploading
      ? i18n.t('recorder.uploading')
      : i18n.t('recorder.recording');
  }

  get timeLabel() {
    return formatSeconds(this.elapsedSec);
  }

  get uploadPercent() {
    if (!this.uploadTotal) return 0;

    return Math.min(
      100,
      Math.round((this.uploadSent / this.uploadTotal) * 100),
    );
  }

  /** Idempotent; call once from the layout under isTauri(). */
  setup = () => {
    if (this.isSetup || !isTauri()) return;
    this.isSetup = true;

    this.recorder.onCallDetected(this.handleCallDetected);
    this.recorder.onCallEnded(this.handleCallEnded);
    this.recorder.onRecordingStopped(this.handleRecordingStopped);
    this.recorder.onUploadProgress(this.handleUploadProgress);

    void this.restoreState();
  };

  acceptPrompt = () => {
    if (this.status !== RecorderStatus.Prompting) return;

    void this.startRecording(this.source);
  };

  skipPrompt = () => {
    if (this.status !== RecorderStatus.Prompting) return;

    this.skippedCurrentCall = true;
    this.status = RecorderStatus.Idle;
  };

  /** Manual recording (e.g. an in-person meeting), no call detection involved. */
  startManualRecording = () => this.startRecording('other', 'manual');

  stop = () => {
    if (this.status !== RecorderStatus.Recording) return;

    // The rest of the pipeline runs in handleRecordingStopped — the same
    // path as a tray-initiated stop.
    void this.recorder.stopRecording().catch(() => {
      this.toasts.show('error', i18n.t('recorder.stop_failed') ?? '');
    });
  };

  setAutoRecord = (value: boolean) => {
    this.autoRecord = value;
    localStorage.setItem(AUTO_RECORD_KEY, String(value));
  };

  /** Re-adopt a recording that survived a webview reload. */
  private restoreState = async () => {
    try {
      const state = await this.recorder.getState();
      if (state.state !== 'recording') return;

      const pending = this.readPending();

      this.status = RecorderStatus.Recording;
      this.localId = state.localId;
      this.recordingPath = state.path;
      this.startedAtMs = state.startedAt;
      this.meetingId =
        pending?.localId === state.localId ? pending.meetingId : null;
      this.source =
        pending?.localId === state.localId ? pending.source : 'other';
      this.startTimer();
    } catch {
      // Recorder state is unavailable — stay idle.
    }
  };

  private handleCallDetected = (event: CallDetectedEvent) => {
    if (this.status !== RecorderStatus.Idle || this.skippedCurrentCall) return;

    this.source = event.source;

    if (this.autoRecord) {
      void this.startRecording(event.source);
    } else {
      this.status = RecorderStatus.Prompting;
    }
  };

  private handleCallEnded = () => {
    this.skippedCurrentCall = false;

    if (this.status === RecorderStatus.Prompting) {
      this.status = RecorderStatus.Idle;
    } else if (this.status === RecorderStatus.Recording) {
      this.stop();
    }
  };

  private startRecording = async (
    source: CallSource,
    meetingSource: CallSource | 'manual' = source,
  ) => {
    if (this.isBarVisible || this.isStarting) return;
    this.isStarting = true;

    try {
      const started = await this.recorder.startRecording();

      this.status = RecorderStatus.Recording;
      this.source = source;
      this.localId = started.localId;
      this.recordingPath = started.path;
      this.startedAtMs = started.startedAt;
      this.meetingId = null;
      this.startTimer();
      this.writePending();

      // The meeting shows up in the list as "recording" right away. If this
      // call fails we keep recording and create the meeting on stop instead.
      try {
        const meeting = await this.meetings.create({
          source: meetingSource,
          startedAt: new Date(started.startedAt).toISOString(),
        });
        this.meetingId = meeting.id;
        this.writePending();
      } catch {
        // Deferred to finishAndUpload().
      }
    } catch {
      this.status = RecorderStatus.Idle;
      this.toasts.show('error', i18n.t('recorder.start_failed') ?? '');
    } finally {
      this.isStarting = false;
    }
  };

  private handleRecordingStopped = (result: StopRecordingResult) => {
    if (this.status !== RecorderStatus.Recording) return;
    if (this.localId && result.localId !== this.localId) return;

    this.stopTimer();
    this.status = RecorderStatus.Uploading;
    this.uploadSent = 0;
    this.uploadTotal = 0;

    void this.finishAndUpload(result);
  };

  private finishAndUpload = async (result: StopRecordingResult) => {
    try {
      let meetingId = this.meetingId;

      if (!meetingId) {
        const meeting = await this.meetings.create({
          source: this.source,
          startedAt: new Date(result.startedAt).toISOString(),
        });
        meetingId = meeting.id;
      }

      await this.meetingsService.update(meetingId, {
        endedAt: new Date(
          result.startedAt + result.durationSec * 1000,
        ).toISOString(),
        durationSec: result.durationSec,
      });

      const { accessToken } = await this.recorder.fetchUploadToken();
      await this.recorder.uploadRecording(result.path, meetingId, accessToken);

      // Uploaded to the server — the local copy is no longer needed.
      await this.recorder.deleteRecording(result.path).catch(() => {});

      this.toasts.show('success', i18n.t('recorder.upload_done') ?? '');
      await this.meetings.load();
    } catch {
      this.toasts.show('error', i18n.t('recorder.upload_failed') ?? '');
    } finally {
      this.clearPending();
      this.status = RecorderStatus.Idle;
      this.meetingId = null;
      this.localId = null;
      this.recordingPath = null;
      this.startedAtMs = null;
    }
  };

  private handleUploadProgress = (event: UploadProgressEvent) => {
    if (this.recordingPath && event.path !== this.recordingPath) return;

    this.uploadSent = event.sent;
    this.uploadTotal = event.total;
  };

  private startTimer = () => {
    this.stopTimer();
    this.updateElapsed();
    this.timerId = setInterval(this.updateElapsed, 1000);
  };

  private stopTimer = () => {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  };

  private updateElapsed = () => {
    this.elapsedSec = this.startedAtMs
      ? Math.max(0, Math.floor((Date.now() - this.startedAtMs) / 1000))
      : 0;
  };

  private writePending = () => {
    if (!this.localId) return;

    const pending: PendingRecording = {
      localId: this.localId,
      meetingId: this.meetingId,
      source: this.source,
    };
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  };

  private readPending = (): PendingRecording | null => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);

      return raw ? (JSON.parse(raw) as PendingRecording) : null;
    } catch {
      return null;
    }
  };

  private clearPending = () => {
    localStorage.removeItem(PENDING_KEY);
  };
}
