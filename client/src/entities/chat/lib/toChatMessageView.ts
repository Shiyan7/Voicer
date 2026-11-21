import { ChatMessageOutput, ChatRole } from '@schema';

import { parseMarkdown, toPlainText } from '@/shared/lib/markdown';

import { PENDING_CITATION } from '../config/chatConfig';
import { ChatMessageView } from '../types/ChatMessageView';

const toVisibleContent = (message: ChatMessageOutput) =>
  message.isStreaming
    ? message.content.replace(PENDING_CITATION, '')
    : message.content;

export const toChatMessageView = (
  message: ChatMessageOutput,
  isLive: boolean,
): ChatMessageView => {
  const isUser = message.role === ChatRole.User;
  const blocks = isUser ? [] : parseMarkdown(toVisibleContent(message));

  return {
    id: message.id,
    isUser,
    plainText: isUser ? message.content : toPlainText(blocks),
    blocks,
    isStreaming: message.isStreaming,
    isFailed: message.isFailed,
    isLive,
  };
};
