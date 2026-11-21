import { Accessor } from 'solid-js';

export interface ChatMessagesDeps {
  threadId: Accessor<string | undefined>;
  createThread?: () => Promise<string | undefined>;
  onAsked?: () => void;
}
