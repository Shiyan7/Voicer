import { ActionItemsService } from '@/entities/action-item';
import { MeetingDetails, MeetingsService, MeetingsViewModel } from '@/entities/meeting';
import { ToastsViewModel } from '@/entities/toasts';
import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { parseMarkdownBlocks } from '@/shared/lib/markdown';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { formatMs, formatSeconds } from '@/shared/lib/time';
import { LocationService, paths, RouterService } from '@/shared/router';
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
export class MeetingDetailsViewModel extends StatefulViewModel {
  meeting: MeetingDetails | null = null;

  isLoading = true;

  loadFailed = false;

  isEditingTitle = false;

  titleDraft = '';

  isDeleting = false;

  currentTimeMs = 0;

  private meetingId = '';

  private playerApi: AudioPlayerApi | null = null;

  private unsubscribeSocket?: () => void;

  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly actionItemsService: ActionItemsService,
    private readonly meetings: MeetingsViewModel,
    private readonly socket: SocketService,
    private readonly location: LocationService,
    private readonly router: RouterService,
    private readonly toasts: ToastsViewModel,
  ) {
    super();
  }

  get title() {
    return this.meeting?.title?.trim() || i18n.t('meetings.untitled');
  }

  get metaLabel() {
    if (!this.meeting) return '';

    const date = new Intl.DateTimeFormat(i18n.locale(), {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(this.meeting.startedAt));

    const duration =
      this.meeting.durationSec != null
        ? formatSeconds(this.meeting.durationSec)
        : null;

    return [date, duration].filter(Boolean).join(' · ');
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

  get summaryBlocks() {
    return this.meeting?.summary
      ? parseMarkdownBlocks(this.meeting.summary)
      : [];
  }

  get segments() {
    return (this.meeting?.segments ?? []).map((segment) => ({
      id: segment.id,
      speakerLabel:
        segment.speaker === 'me'
          ? i18n.t('meetings.speaker.me')
          : i18n.t('meetings.speaker.other'),
      speaker: segment.speaker,
      timeLabel: formatMs(segment.startMs),
      text: segment.text,
      isActive:
        this.currentTimeMs >= segment.startMs &&
        this.currentTimeMs < segment.endMs,
      startMs: segment.startMs,
    }));
  }

  get actionItems() {
    return this.meeting?.actionItems ?? [];
  }

  get backPath() {
    return paths.meetings;
  }

  setPlayerApi = (api: AudioPlayerApi) => {
    this.playerApi = api;
  };

  onPlayerTimeUpdate = (seconds: number) => {
    this.currentTimeMs = seconds * 1000;
  };

  seekToSegment = (startMs: number) => {
    this.playerApi?.seek(startMs / 1000, { play: true });
  };

  startTitleEdit = () => {
    if (!this.meeting) return;

    this.titleDraft = this.meeting.title ?? '';
    this.isEditingTitle = true;
  };

  onTitleInput = (event: Event) => {
    this.titleDraft = (event.target as HTMLInputElement).value;
  };

  onTitleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    } else if (event.key === 'Escape') {
      this.isEditingTitle = false;
    }
  };

  commitTitle = async () => {
    if (!this.isEditingTitle || !this.meeting) return;

    this.isEditingTitle = false;

    const next = this.titleDraft.trim();
    const prev = this.meeting.title;

    if (!next || next === prev) return;

    this.meeting.title = next;
    this.meetings.applyUpdate(this.meetingId, { title: next });

    try {
      await this.meetingsService.update(this.meetingId, { title: next });
    } catch {
      this.meeting.title = prev;
      this.meetings.applyUpdate(this.meetingId, { title: prev });
      this.toasts.show('error', i18n.t('meetings.rename_failed'));
    }
  };

  toggleActionItem = async (id: string) => {
    const item = this.meeting?.actionItems.find((it) => it.id === id);

    if (!item) return;

    const next = !item.isDone;
    item.isDone = next;

    try {
      await this.actionItemsService.toggle(id, next);
    } catch {
      item.isDone = !next;
      this.toasts.show('error', i18n.t('actions.update_failed'));
    }
  };

  requestDelete = () => showModal(MODALS.DELETE_MEETING);

  cancelDelete = () => closeModal(MODALS.DELETE_MEETING);

  confirmDelete = async () => {
    this.isDeleting = true;

    try {
      await this.meetings.remove(this.meetingId);
      closeModal(MODALS.DELETE_MEETING);
      this.router.push(paths.meetings);
    } catch {
      this.toasts.show('error', i18n.t('meetings.delete_failed'));
    } finally {
      this.isDeleting = false;
    }
  };

  protected onMount() {
    this.meetingId = this.location.pathname?.split('/')[2] ?? '';

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
