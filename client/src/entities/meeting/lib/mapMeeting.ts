import type { MeetingOutput } from '@schema';

import { getInitialMeetingTitle } from '@/shared/lib/time';

import { MeetingDetails } from '../types/MeetingDetails';

export function mapMeeting(meeting?: MeetingOutput): MeetingDetails | null {
  if (!meeting) return null;

  return {
    id: meeting.id,
    title: meeting.title?.trim() || getInitialMeetingTitle(meeting.startedAt),
    status: meeting.status,
    audioUrl: meeting.audioUrl ?? null,
    durationSec: meeting.durationSec ?? null,
    startedAt: meeting.startedAt,
  };
}
