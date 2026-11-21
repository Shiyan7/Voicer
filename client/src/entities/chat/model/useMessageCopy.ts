import { createSignal } from 'solid-js';

import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';

import { ChatMessageView } from '../types/ChatMessageView';

export const useMessageCopy = () => {
  const [copiedId, setCopiedId] = createSignal<string | null>(null);
  const clipboard = useCopyToClipboard();

  const copyMessage = (message: ChatMessageView) => {
    setCopiedId(message.id);
    void clipboard.copy(message.plainText);
  };

  const isCopied = (id: string) => clipboard.isCopied() && copiedId() === id;

  return { copyMessage, isCopied };
};
