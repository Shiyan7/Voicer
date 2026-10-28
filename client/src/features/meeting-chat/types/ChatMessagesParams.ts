import { Accessor } from 'solid-js';

export interface ChatMessagesParams {
  meetingId: Accessor<string>;
  isActive: Accessor<boolean>;
}
