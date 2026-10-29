import { MeetingStatus } from '../meetings/meeting.entity';

export interface McpMeeting {
  id: string;
  title: string | null;
  source: string | null;
  status: MeetingStatus;
  startedAt: Date;
  durationSec: number | null;
  isFavorite: boolean;
}
