import { MeetingStatus } from '@schema';

export interface StatePanelDeps {
  variant: 'processing' | 'failed';
  status: MeetingStatus;
}
