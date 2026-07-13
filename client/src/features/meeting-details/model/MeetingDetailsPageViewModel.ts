import {
  isMeetingAudioReady,
  isMeetingProcessing,
  MeetingDetails,
  MeetingsService,
} from '@/entities/meeting';
import { injectable } from '@/shared/di';
import { RouterService } from '@/shared/router';
import { SocketService } from '@/shared/socket';
import { AudioPlayerApi } from '@/shared/ui/audio-player';
import { StatefulViewModel } from '@/shared/view-model';

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
    private readonly socket: SocketService,
    private readonly router: RouterService<{ id: string }>,
  ) {
    super();
  }

  get isReady() {
    return this.meeting?.status === 'ready';
  }

  get statePanelVariant(): 'processing' | 'failed' | null {
    if (!this.meeting) return null;
    if (this.meeting.status === 'failed') return 'failed';

    return isMeetingProcessing(this.meeting.status) ? 'processing' : null;
  }

  get showPlayer() {
    return !!this.meeting && isMeetingAudioReady(this.meeting.status);
  }

  get audioUrl() {
    return this.meetingsService.getAudioUrl(this.meetingId);
  }

  private get meetingId() {
    return this.router.params.id;
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
