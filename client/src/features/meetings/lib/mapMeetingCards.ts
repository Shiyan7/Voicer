import type { MeetingOutput } from '@schema';

import {
  formatDurationLabel,
  formatShortDateTime,
  getInitialMeetingTitle,
} from '@/shared/lib/time';

import { MeetingCardData } from '../types/MeetingCardData';

export function mapMeetingCards(meetings?: MeetingOutput[]): MeetingCardData[] {
  if (!meetings?.length) return [];

  return meetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.title?.trim() || getInitialMeetingTitle(meeting.startedAt),
    duration: formatDurationLabel(meeting.durationSec),
    dateLabel: formatShortDateTime(meeting.startedAt),
  }));
}
