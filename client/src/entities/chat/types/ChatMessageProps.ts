import { JSX } from 'solid-js';

import type { MarkdownTime } from '@/shared/lib/markdown';

import { ChatMessageView } from './ChatMessageView';

export interface ChatMessageProps {
  message: ChatMessageView;
  isCopied: boolean;
  renderTime: (time: MarkdownTime) => JSX.Element;
  onCopy: (message: ChatMessageView) => void;
}
