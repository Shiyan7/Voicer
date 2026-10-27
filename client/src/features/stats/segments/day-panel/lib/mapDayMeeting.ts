import type { StatsDayMeetingOutput } from '@schema';

import { getMeetingTitle } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { formatDurationLabel } from '@/shared/lib/time';
import { paths } from '@/shared/router';

import { DayMeetingView } from '../types/DayMeetingView';

export const mapDayMeeting = (
  meeting: StatsDayMeetingOutput,
): DayMeetingView => ({
  id: meeting.id,
  href: paths.meeting(meeting.id),
  title: getMeetingTitle(meeting),
  source: meeting.source ?? null,
  time: new Intl.DateTimeFormat(i18n.locale(), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(meeting.startedAt)),
  duration: formatDurationLabel(meeting.durationSec),
});
