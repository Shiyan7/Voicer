import type { MeetingOutput } from '@schema';

import { i18n } from '@/shared/i18n';

import { MeetingDetails } from '../types/MeetingDetails';

export function mapMeeting(meeting?: MeetingOutput): MeetingDetails | null {
  if (!meeting) return null;

  return {
    id: meeting.id,
    title: meeting.title ?? i18n.t('meetings.untitled'),
    status: meeting.status,
    audioUrl: meeting.audioUrl ?? null,
    durationSec: meeting.durationSec ?? null,
    startedAt: meeting.startedAt,
  };
}
