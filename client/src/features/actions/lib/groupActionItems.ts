import { ActionItemData } from '@/entities/action-item';
import { paths } from '@/shared/router/paths';

import { ActionItemGroup } from '../types/ActionItemGroup';

export function groupActionItems(items: ActionItemData[]): ActionItemGroup[] {
  const groups = new Map<string, ActionItemGroup>();

  for (const item of items) {
    const group = groups.get(item.meetingId);

    if (group) {
      group.items.push(item);
      continue;
    }

    groups.set(item.meetingId, {
      meetingId: item.meetingId,
      title: item.meetingTitle,
      meetingHref: paths.meeting(item.meetingId),
      items: [item],
    });
  }

  return [...groups.values()];
}
