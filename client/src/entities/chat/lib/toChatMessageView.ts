import { ChatMessageOutput, ChatRole } from '@schema';

import { parseMarkdown } from '@/shared/lib/markdown';

import { PENDING_CITATION } from '../config/chatConfig';
import { ChatMessageView } from '../types/ChatMessageView';
import { toPlainText } from './toPlainText';

const toVisibleContent = (message: ChatMessageOutput) =>
  message.isStreaming
    ? message.content.replace(PENDING_CITATION, '')
    : message.content;

export const toChatMessageView = (
  message: ChatMessageOutput,
): ChatMessageView => {
  const isUser = message.role === ChatRole.User;

  return {
    id: message.id,
    isUser,
    text: message.content,
    plainText: toPlainText(message.content),
    blocks: isUser ? [] : parseMarkdown(toVisibleContent(message)),
    isStreaming: message.isStreaming,
    isFailed: message.isFailed,
  };
};
