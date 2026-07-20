import type { MeetingOutput } from '@schema';

import { MeetingDetails } from '../types/MeetingDetails';
import { getMeetingTitle } from './getMeetingTitle';

export function mapMeeting(meeting?: MeetingOutput): MeetingDetails | null {
  if (!meeting) return null;

  return {
    id: meeting.id,
    title: getMeetingTitle(meeting.source, meeting.startedAt),
    status: meeting.status,
    audioUrl: meeting.audioUrl ?? null,
    durationSec: meeting.durationSec ?? null,
    startedAt: meeting.startedAt,
  };
}
