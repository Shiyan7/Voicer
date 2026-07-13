import { MeetingsService } from '@/entities/meeting';
import { ToastsViewModel } from '@/entities/toasts';
import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { formatSeconds } from '@/shared/lib/time';
import { paths, RouterService } from '@/shared/router';
import { StatefulViewModel } from '@/shared/view-model';

import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';

@injectable()
export class DetailsHeaderViewModel extends StatefulViewModel<DetailsHeaderDeps> {
  isEditingTitle = false;

  titleDraft = '';

  isDeleting = false;

  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly router: RouterService,
    private readonly toasts: ToastsViewModel,
  ) {
    super();
  }

  private get meeting() {
    return this.deps.meeting;
  }

  get status() {
    return this.meeting.status;
  }

  get title() {
    return this.meeting.title?.trim() || i18n.t('meetings.untitled');
  }

  get metaLabel() {
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

  startTitleEdit = () => {
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
    if (!this.isEditingTitle) return;

    this.isEditingTitle = false;

    const next = this.titleDraft.trim();
    const prev = this.meeting.title;

    if (!next || next === prev) return;

    this.meeting.title = next;

    try {
      await this.meetingsService.update(this.meeting.id, { title: next });
    } catch {
      this.meeting.title = prev;
      this.toasts.show('error', i18n.t('meetings.rename_failed'));
    }
  };

  requestDelete = () => showModal(MODALS.DELETE_MEETING);

  cancelDelete = () => closeModal(MODALS.DELETE_MEETING);

  confirmDelete = async () => {
    this.isDeleting = true;

    try {
      await this.meetingsService.remove(this.meeting.id);
      closeModal(MODALS.DELETE_MEETING);
      this.router.push(paths.meetings);
    } catch {
      this.toasts.show('error', i18n.t('meetings.delete_failed'));
    } finally {
      this.isDeleting = false;
    }
  };
}
