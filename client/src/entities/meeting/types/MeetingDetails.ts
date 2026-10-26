import { MeetingStatus } from '@schema';

export interface MeetingDetails {
  id: string;
  title?: string;
  status: MeetingStatus;
  audioUrl: string | null;
  durationSec: number | null;
  isFavorite: boolean;
  startedAt: string;
}
