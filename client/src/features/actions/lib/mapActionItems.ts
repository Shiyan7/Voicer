import type { ActionItemOutput } from '@schema';

import { ActionItemData } from '@/entities/action-item';
import { i18n } from '@/shared/i18n';

export function mapActionItems(items?: ActionItemOutput[]): ActionItemData[] {
  if (!items?.length) return [];

  return items.map((item) => ({
    id: item.id,
    meetingId: item.meetingId,
    text: item.text,
    isDone: item.isDone,
    createdAt: item.createdAt,
    meetingTitle: item.meetingTitle?.trim() || i18n.t('meetings.untitled'),
  }));
}
