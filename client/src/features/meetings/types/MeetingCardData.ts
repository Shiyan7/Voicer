import { MeetingStatus } from '@schema';

export interface MeetingCardData {
  id: string;
  title?: string;
  status: MeetingStatus;
  source?: string | null;
}
