import { ActionItemData } from '@/entities/action-item';

export type MeetingSource =
  'zoom' | 'meet' | 'teams' | 'telegram' | 'discord' | 'other' | 'manual';

export type MeetingStatus =
  | 'recording'
  | 'uploading'
  | 'uploaded'
  | 'transcribing'
  | 'summarizing'
  | 'ready'
  | 'failed';

export type Speaker = 'me' | 'other';

export type Meeting = {
  id: string;
  title: string | null;
  source: MeetingSource;
  status: MeetingStatus;
  startedAt: string;
  endedAt: string | null;
  durationSec: number | null;
  summary: string | null;
  createdAt: string;
};

export type MeetingListItem = Meeting;

export type TranscriptSegment = {
  id: string;
  speaker: Speaker;
  startMs: number;
  endMs: number;
  text: string;
};

export type MeetingDetails = Meeting & {
  segments: TranscriptSegment[];
  actionItems: ActionItemData[];
};

export type CreateMeetingInput = {
  title?: string;
  source: MeetingSource;
  startedAt: string;
  language?: 'ru' | 'en';
};

export type UpdateMeetingInput = {
  title?: string;
  endedAt?: string;
  durationSec?: number;
};
