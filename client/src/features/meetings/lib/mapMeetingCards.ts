import type { MeetingOutput } from '@schema';

import { i18n } from '@/shared/i18n';
import { formatDurationLabel, formatShortDateTime } from '@/shared/lib/time';

import { MeetingCardData } from '../types/MeetingCardData';

export function mapMeetingCards(meetings?: MeetingOutput[]): MeetingCardData[] {
  if (!meetings?.length) return [];

  return meetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.title?.trim() || i18n.t('meetings.untitled'),
    duration: formatDurationLabel(meeting.durationSec),
    dateLabel: formatShortDateTime(meeting.startedAt),
  }));
}
