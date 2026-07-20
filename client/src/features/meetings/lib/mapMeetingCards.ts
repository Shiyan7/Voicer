import type { MeetingOutput } from '@schema';

import { getMeetingTitle } from '@/entities/meeting';
import { formatDurationLabel, formatShortDateTime } from '@/shared/lib/time';

import { MeetingCardData } from '../types/MeetingCardData';

export function mapMeetingCards(meetings?: MeetingOutput[]): MeetingCardData[] {
  if (!meetings?.length) return [];

  return meetings.map((meeting) => ({
    id: meeting.id,
    title: getMeetingTitle(meeting.source, meeting.startedAt),
    duration: formatDurationLabel(meeting.durationSec),
    dateLabel: formatShortDateTime(meeting.startedAt),
  }));
}
