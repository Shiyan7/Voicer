import { injectable } from '@/shared/di';

import { MeetingsService, MeetingsViewModel } from '@/entities/meeting';
import { ToastsViewModel } from '@/entities/toasts';
import { RecorderViewModel } from '@/features/call-recorder';
import { i18n } from '@/shared/i18n';
import { isTauri } from '@/shared/isTauri';
import { formatSeconds } from '@/shared/lib/time';
import { getMeetingPath, RouterService } from '@/shared/router';
import { SocketService } from '@/shared/socket';
import { StatefulViewModel } from '@/shared/view-model';

@injectable()
export class MeetingsPageViewModel extends StatefulViewModel {
  isUploading = false;

  private unsubscribeSocket?: () => void;

  constructor(
    private readonly meetings: MeetingsViewModel,
    private readonly meetingsService: MeetingsService,
    private readonly socket: SocketService,
    private readonly router: RouterService,
    private readonly toasts: ToastsViewModel,
    private readonly recorder: RecorderViewModel,
  ) {
    super();
  }

  get isLoading() {
    return this.meetings.isLoading && this.meetings.meetings.length === 0;
  }

  get isEmpty() {
    return !this.isLoading && this.meetings.meetings.length === 0;
  }

  /** Web-only manual upload (desktop records calls natively). */
  get canUpload() {
    return !isTauri();
  }

  /** Desktop-only manual recording, hidden while a recording is in flight. */
  get canRecord() {
    return isTauri() && !this.recorder.isBarVisible;
  }

  get cards() {
    const dateFormat = new Intl.DateTimeFormat(i18n.locale(), {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    return this.meetings.meetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.title?.trim() || i18n.t('meetings.untitled'),
      status: meeting.status,
      meta: [
        dateFormat.format(new Date(meeting.startedAt)),
        meeting.durationSec != null ? formatSeconds(meeting.durationSec) : null,
      ]
        .filter(Boolean)
        .join(' · '),
    }));
  }

  startRecording = () => {
    void this.recorder.startManualRecording();
  };

  openMeeting = (id: string) => {
    this.router.push(getMeetingPath(id));
  };

  onFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || this.isUploading) return;

    this.isUploading = true;

    try {
      const meeting = await this.meetings.create({
        title: file.name.replace(/\.[^.]+$/, ''),
        source: 'manual',
        startedAt: new Date().toISOString(),
      });

      const uploaded = await this.meetingsService.uploadAudio(meeting.id, file);
      this.meetings.applyUpdate(meeting.id, { status: uploaded.status });
    } catch {
      this.toasts.show('error', i18n.t('meetings.upload_failed'));
    } finally {
      this.isUploading = false;
    }
  };

  protected onMount() {
    void this.meetings.load();

    this.socket.connect();
    this.unsubscribeSocket = this.socket.onMeetingUpdated(({ id, status }) =>
      this.meetings.applyUpdate(id, { status }),
    );
  }

  protected onDispose() {
    this.unsubscribeSocket?.();
  }
}
