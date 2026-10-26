import type { ActionItemOutput } from '@schema';

import { ActionItemData } from '@/entities/action-item';
import { getMeetingTitle } from '@/entities/meeting';

export function mapActionItems(items?: ActionItemOutput[]): ActionItemData[] {
  if (!items?.length) return [];

  return items.map((item) => ({
    id: item.id,
    meetingId: item.meetingId,
    text: item.text,
    isDone: item.isDone,
    createdAt: item.createdAt,
    meetingTitle: getMeetingTitle(item.meetingSource, item.meetingStartedAt),
    isFocused: false,
  }));
}
