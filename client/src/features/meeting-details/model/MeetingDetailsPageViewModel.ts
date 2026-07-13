import {
  MeetingDetails,
  MeetingsService,
  MeetingsViewModel,
  TranscriptSegment,
} from '@/entities/meeting';
import { injectable } from '@/shared/di';
import { RouterService } from '@/shared/router';
import { SocketService } from '@/shared/socket';
import { AudioPlayerApi } from '@/shared/ui/audio-player';
import { StatefulViewModel } from '@/shared/view-model';

const PROCESSING_STATUSES = new Set([
  'recording',
  'uploading',
  'uploaded',
  'transcribing',
  'summarizing',
]);

const PLAYABLE_STATUSES = new Set([
  'uploaded',
  'transcribing',
  'summarizing',
  'ready',
]);

@injectable()
export class MeetingDetailsPageViewModel extends StatefulViewModel {
  meeting: MeetingDetails | null = null;

  isLoading = true;

  loadFailed = false;

  currentTimeMs = 0;

  private playerApi: AudioPlayerApi | null = null;

  private unsubscribeSocket?: () => void;

  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly meetings: MeetingsViewModel,
    private readonly socket: SocketService,
    private readonly router: RouterService<{ id: string }>,
  ) {
    super();
  }

  get meetingId() {
    return this.router.params.id;
  }

  get isProcessing() {
    return !!this.meeting && PROCESSING_STATUSES.has(this.meeting.status);
  }

  get isFailed() {
    return this.meeting?.status === 'failed';
  }

  get isReady() {
    return this.meeting?.status === 'ready';
  }

  get showPlayer() {
    return !!this.meeting && PLAYABLE_STATUSES.has(this.meeting.status);
  }

  get audioUrl() {
    return this.meetingsService.getAudioUrl(this.meetingId);
  }

  get summary() {
    return this.meeting?.summary ?? '';
  }

  get transcriptSegments(): TranscriptSegment[] {
    return this.meeting?.segments ?? [];
  }

  get actionItems() {
    return this.meeting?.actionItems ?? [];
  }

  setPlayerApi = (api: AudioPlayerApi) => {
    this.playerApi = api;
  };

  onPlayerTimeUpdate = (seconds: number) => {
    this.currentTimeMs = seconds * 1000;
  };

  seekTo = (startMs: number) => {
    this.playerApi?.seek(startMs / 1000, { play: true });
  };

  protected onMount() {
    void this.load();

    this.socket.connect();
    this.unsubscribeSocket = this.socket.onMeetingUpdated(({ id, status }) => {
      if (id !== this.meetingId || !this.meeting) return;

      this.meetings.applyUpdate(id, { status });

      if (status === 'ready' || status === 'failed') {
        void this.load();
      } else {
        this.meeting.status = status;
      }
    });
  }

  protected onDispose() {
    this.unsubscribeSocket?.();
  }

  private async load() {
    try {
      this.meeting = await this.meetingsService.get(this.meetingId);
    } catch {
      this.loadFailed = true;
    } finally {
      this.isLoading = false;
    }
  }
}
