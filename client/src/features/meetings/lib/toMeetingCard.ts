import { Meeting } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { formatDateTime, formatSeconds } from '@/shared/lib/time';

import { MeetingCardData } from '../types/MeetingCardData';

export function toMeetingCard(meeting: Meeting): MeetingCardData {
  return {
    id: meeting.id,
    title: meeting.title?.trim() || i18n.t('meetings.untitled'),
    status: meeting.status,
    meta: [
      formatDateTime(meeting.startedAt),
      meeting.durationSec != null ? formatSeconds(meeting.durationSec) : null,
    ]
      .filter(Boolean)
      .join(' · '),
  };
}
