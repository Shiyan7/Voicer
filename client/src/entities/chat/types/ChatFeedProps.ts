import { JSX } from 'solid-js';

import type { MarkdownTime } from '@/shared/lib/markdown';

import { ChatMessageView } from './ChatMessageView';

export interface ChatFeedProps {
  messages: ChatMessageView[];
  followUps: string[];
  isThinking: boolean;
  isAnswering: boolean;
  thinkingLabel: string;
  isCopied: (id: string) => boolean;
  renderTime: (time: MarkdownTime) => JSX.Element;
  onCopy: (message: ChatMessageView) => void;
  onAsk: (question: string) => void;
}
