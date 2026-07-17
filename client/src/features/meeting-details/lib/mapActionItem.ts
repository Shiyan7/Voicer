import type { ActionItemOutput } from '@schema';

import { ActionItemData } from '@/entities/action-item';

export function mapActionItem(item: ActionItemOutput): ActionItemData {
  return {
    id: item.id,
    meetingId: item.meetingId,
    text: item.text,
    isDone: item.isDone,
    createdAt: item.createdAt,
    meetingTitle: item.meetingTitle ?? undefined,
  };
}
