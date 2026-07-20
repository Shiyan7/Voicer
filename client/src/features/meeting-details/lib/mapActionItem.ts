import type { ActionItemOutput } from '@schema';

import { ActionItemData } from '@/entities/action-item';
import { getMeetingTitle } from '@/entities/meeting';

export function mapActionItem(item: ActionItemOutput): ActionItemData {
  return {
    id: item.id,
    meetingId: item.meetingId,
    text: item.text,
    isDone: item.isDone,
    createdAt: item.createdAt,
    meetingTitle: getMeetingTitle(item.meetingSource, item.meetingStartedAt),
  };
}
