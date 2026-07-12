import { injectable } from '@/shared/di';

import { ActionItemsViewModel } from '@/entities/action-item';
import { ActionItem } from '@/entities/meeting';
import { ToastsViewModel } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';
import { getMeetingPath } from '@/shared/router';
import { Tab } from '@/shared/ui/tabs';
import { StatefulViewModel } from '@/shared/view-model';

type ActionsFilter = 'open' | 'all';

export type ActionItemGroup = {
  meetingId: string;
  title: string;
  meetingHref: string;
  items: ActionItem[];
};

@injectable()
export class ActionsPageViewModel extends StatefulViewModel {
  filter: ActionsFilter = 'open';

  constructor(
    private readonly actionItems: ActionItemsViewModel,
    private readonly toasts: ToastsViewModel,
  ) {
    super();
  }

  protected onMount() {
    void this.actionItems.load();
  }

  get isLoading() {
    return this.actionItems.isLoading && this.actionItems.items.length === 0;
  }

  get tabs(): Tab[] {
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

  setFilter = (value: string) => {
    this.filter = value as ActionsFilter;
  };

  toggle = async (id: string) => {
    try {
      await this.actionItems.toggleDone(id);
    } catch {
      this.toasts.show('error', i18n.t('actions.update_failed'));
    }
  };
}
