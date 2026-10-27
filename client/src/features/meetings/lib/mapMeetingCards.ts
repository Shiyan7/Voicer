import type { MeetingOutput } from '@schema';

import { getMeetingTitle } from '@/entities/meeting';
import {
  formatDurationLabel,
  formatRelativeTime,
  formatShortDateTime,
} from '@/shared/lib/time';
import { paths } from '@/shared/router';

import { MeetingCardData } from '../types/MeetingCardData';

export function mapMeetingCards(meetings?: MeetingOutput[]): MeetingCardData[] {
  if (!meetings?.length) return [];

  return meetings.map((meeting) => ({
    id: meeting.id,
    href: paths.meeting(meeting.id),
    title: getMeetingTitle(meeting.source, meeting.startedAt),
    duration: formatDurationLabel(meeting.durationSec),
    dateLabel: formatRelativeTime(meeting.startedAt),
    dateTitle: formatShortDateTime(meeting.startedAt),
  }));
}
