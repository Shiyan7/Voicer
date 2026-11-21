import type { MarkdownBlock } from '@/shared/lib/markdown';

export interface ChatMessageView {
  id: string;
  isUser: boolean;
  plainText: string;
  blocks: MarkdownBlock[];
  isStreaming: boolean;
  isFailed: boolean;
  isLive: boolean;
}
