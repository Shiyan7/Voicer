import { Accessor } from 'solid-js';

export interface ChatMessagesDeps {
  meetingId: Accessor<string>;
  isActive: Accessor<boolean>;
}
