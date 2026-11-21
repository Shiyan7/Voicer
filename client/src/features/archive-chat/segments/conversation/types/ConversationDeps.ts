import { Accessor } from 'solid-js';

export interface ConversationDeps {
  threadId: Accessor<string | undefined>;
  createThread: () => Promise<string | undefined>;
  onAsked: () => void;
}
