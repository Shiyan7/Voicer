import { ChatMessageOutput, ChatRole } from '@schema';

import { PENDING_MESSAGE_ID } from '../config/chatConfig';

export const toPendingMessage = (question: string): ChatMessageOutput => ({
  id: PENDING_MESSAGE_ID,
  threadId: '',
  role: ChatRole.User,
  content: question,
  followUps: [],
  isStreaming: false,
  isFailed: false,
  createdAt: '',
});
