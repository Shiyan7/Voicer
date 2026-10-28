import { ChatMessageOutput, ChatRole } from '@schema';

import { ChatMessageView } from '../types/ChatMessageView';
import { parseChatContent } from './parseChatContent';

export const toChatMessageView = (
  message: ChatMessageOutput,
): ChatMessageView => {
  const isUser = message.role === ChatRole.User;

  return {
    id: message.id,
    isUser,
    text: message.content,
    blocks: isUser ? [] : parseChatContent(message.content),
    isFailed: message.isFailed,
  };
};
