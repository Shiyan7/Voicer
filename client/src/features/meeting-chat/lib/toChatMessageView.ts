import { ChatMessageOutput, ChatRole } from '@schema';

import { parseMarkdown } from '@/shared/lib/markdown';

import { ChatMessageView } from '../types/ChatMessageView';


export const toChatMessageView = (
  message: ChatMessageOutput,
): ChatMessageView => {
  const isUser = message.role === ChatRole.User;

  return {
    id: message.id,
    isUser,
    text: message.content,
    blocks: isUser ? [] : parseMarkdown(message.content),
    isFailed: message.isFailed,
  };
};
