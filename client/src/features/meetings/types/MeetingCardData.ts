import { MeetingStatus } from '@/entities/meeting';

export interface MeetingCardData {
  id: string;
  title: string;
  meta: string;
  status: MeetingStatus;
}
