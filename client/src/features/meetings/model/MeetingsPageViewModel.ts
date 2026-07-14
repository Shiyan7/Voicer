import { Meeting, MeetingsService } from '@/entities/meeting';
import { ToastsViewModel } from '@/entities/toasts';
import { RecorderViewModel } from '@/features/call-recorder';
import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { isTauri } from '@/shared/isTauri';
import { paths, RouterService } from '@/shared/router';
import { SocketService } from '@/shared/socket';
import { StatefulViewModel } from '@/shared/view-model';

import { toMeetingCard } from '../lib/toMeetingCard';
import { MeetingCardData } from '../types/MeetingCardData';

@injectable()
export class MeetingsPageViewModel extends StatefulViewModel {
  meetings: Meeting[] = [];

  isLoading = true;

  isUploading = false;

  private unsubscribeSocket?: () => void;

  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly socket: SocketService,
    private readonly router: RouterService,
    private readonly toasts: ToastsViewModel,
    private readonly recorder: RecorderViewModel,
  ) {
    super();
  }

  get isEmpty() {
    return !this.isLoading && this.meetings.length === 0;
  }

  get canUpload() {
    return !isTauri();
  }

  get canRecord() {
    return isTauri() && !this.recorder.isRecordingInFlight;
  }

  get cards(): MeetingCardData[] {
    return this.meetings.map(toMeetingCard);
  }

  startRecording = () => {
    void this.recorder.startManualRecording();
  };

  openMeeting = (id: string) => {
    this.router.push(paths.meeting(id));
  };

  onFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || this.isUploading) return;

    this.isUploading = true;

    try {
      const meeting = await this.meetingsService.create({
        title: file.name.replace(/\.[^.]+$/, ''),
        source: 'manual',
        startedAt: new Date().toISOString(),
        language: i18n.locale(),
      });
      this.meetings = [meeting, ...this.meetings];

      const uploaded = await this.meetingsService.uploadAudio(meeting.id, file);
      this.applyUpdate(meeting.id, { status: uploaded.status });
    } catch {
      this.toasts.show('error', i18n.t('meetings.upload_failed'));
    } finally {
      this.isUploading = false;
    }
  };

  protected onMount() {
    void this.load();

    this.socket.connect();
    this.unsubscribeSocket = this.socket.onMeetingUpdated(({ id, status }) => {
      if (this.meetings.some((meeting) => meeting.id === id)) {
        this.applyUpdate(id, { status });
      } else {
        void this.load();
      }
    });
  }

  protected onDispose() {
    this.unsubscribeSocket?.();
  }

  private async load() {
    try {
      this.meetings = await this.meetingsService.list();
    } finally {
      this.isLoading = false;
    }
  }

  private applyUpdate(id: string, patch: Partial<Meeting>) {
    this.meetings = this.meetings.map((meeting) =>
      meeting.id === id ? { ...meeting, ...patch } : meeting,
    );
  }
}
