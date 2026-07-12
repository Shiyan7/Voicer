import { ActionItemsViewModel } from '@/entities/action-item';
import { ToastsViewModel } from '@/entities/toasts';
import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { getMeetingPath } from '@/shared/router';
import { Tab } from '@/shared/ui/tabs';
import { StatefulViewModel } from '@/shared/view-model';

import { ActionItemGroup } from '../types/ActionItemGroup';
import { ActionsFilter } from '../types/ActionsFilter';

@injectable()
export class ActionsPageViewModel extends StatefulViewModel {
  filter: ActionsFilter = 'open';

  constructor(
    private readonly actionItems: ActionItemsViewModel,
    private readonly toasts: ToastsViewModel,
  ) {
    super();
  }

  get isLoading() {
    return this.actionItems.isLoading && this.actionItems.items.length === 0;
  }

  get tabs(): Tab<ActionsFilter>[] {
    return [
      { value: 'open', label: i18n.t('actions.filter.open') },
      { value: 'all', label: i18n.t('actions.filter.all') },
    ];
  }

  get emptyLabel() {
    return this.actionItems.items.length === 0
      ? i18n.t('actions.empty')
      : i18n.t('actions.empty_open');
  }

  get groups(): ActionItemGroup[] {
    const visible =
      this.filter === 'open'
        ? this.actionItems.items.filter((item) => !item.isDone)
        : this.actionItems.items;

    const groups = new Map<string, ActionItemGroup>();

    for (const item of visible) {
      let group = groups.get(item.meetingId);

      if (!group) {
        group = {
          meetingId: item.meetingId,
          title: item.meetingTitle?.trim() || i18n.t('meetings.untitled'),
          meetingHref: getMeetingPath(item.meetingId),
          items: [],
        };
        groups.set(item.meetingId, group);
      }

      group.items.push(item);
    }

    return [...groups.values()];
  }

  setFilter = (value: ActionsFilter) => {
    this.filter = value;
  };

  toggle = async (id: string) => {
    try {
      await this.actionItems.toggleDone(id);
    } catch {
      this.toasts.show('error', i18n.t('actions.update_failed'));
    }
  };

  protected onMount() {
    void this.actionItems.load();
  }
}
