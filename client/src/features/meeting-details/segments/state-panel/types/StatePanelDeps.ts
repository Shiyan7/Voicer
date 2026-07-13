import { MeetingStatus } from '@/entities/meeting';

export interface StatePanelDeps {
  variant: 'processing' | 'failed';
  status: MeetingStatus;
}
