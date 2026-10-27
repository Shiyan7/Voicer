import type { MeetingOutput } from '@schema';

import { MeetingDetails } from '../types/MeetingDetails';
import { getMeetingSourceLabel } from './getMeetingSourceLabel';
import { getMeetingTitle } from './getMeetingTitle';

export function mapMeeting(meeting?: MeetingOutput): MeetingDetails | null {
  if (!meeting) return null;

  return {
    id: meeting.id,
    title: getMeetingTitle(meeting),
    customTitle: meeting.title ?? null,
    sourceLabel: getMeetingSourceLabel(meeting),
    status: meeting.status,
    audioUrl: meeting.audioUrl ?? null,
    durationSec: meeting.durationSec ?? null,
    isFavorite: meeting.isFavorite,
    summaryStyle: meeting.summaryStyle ?? null,
    summarizationFailed: meeting.summarizationFailed,
    startedAt: meeting.startedAt,
  };
}
