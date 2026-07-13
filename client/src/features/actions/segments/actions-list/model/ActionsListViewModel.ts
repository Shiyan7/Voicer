import { injectable } from 'tsyringe';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { StatefulViewModel } from '@/shared/view-model';

import { ActionItemGroup } from '../types/ActionItemGroup';
import { ActionsListDeps } from '../types/ActionsListDeps';

@injectable()
export class ActionsListViewModel extends StatefulViewModel<ActionsListDeps> {
  constructor() {
    super();
  }

  get visibleItems() {
    if (this.deps.filter === 'open') {
      return this.deps.items.filter((item) => !item.isDone);
    }
    return this.deps.items;
  }

  get groups() {
    const groups = new Map<string, ActionItemGroup>();

    for (const item of this.visibleItems) {
      const newGroup: ActionItemGroup = {
        meetingId: item.meetingId,
        title: item.meetingTitle,
        meetingHref: paths.meeting(item.meetingId),
        items: [],
      };

      const group = groups.get(item.meetingId) ?? newGroup;

      group.items.push(item);
      groups.set(item.meetingId, group);
    }

    return [...groups.values()];
  }

  get isLoading() {
    return this.deps.isLoading;
  }

  get isEmpty() {
    return this.visibleItems.length === 0;
  }

  get emptyLabel() {
    return this.isEmpty
      ? i18n.t('actions.empty')
      : i18n.t('actions.empty_open');
  }
}
