import type { StatsDayMeetingOutput } from '@schema';

import { getMeetingTitle } from '@/entities/meeting';
import { formatDurationLabel, formatTime } from '@/shared/lib/time';
import { paths } from '@/shared/router';

import { DayMeetingView } from '../types/DayMeetingView';

export const mapDayMeeting = (
  meeting: StatsDayMeetingOutput,
): DayMeetingView => ({
  id: meeting.id,
  href: paths.meeting(meeting.id),
  title: getMeetingTitle(meeting),
  source: meeting.source,
  time: formatTime(meeting.startedAt),
  duration: formatDurationLabel(meeting.durationSec),
});
