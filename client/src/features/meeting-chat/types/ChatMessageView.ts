import type { MarkdownBlock } from '@/shared/lib/markdown';

export interface ChatMessageView {
  id: string;
  isUser: boolean;
  text: string;
  blocks: MarkdownBlock[];
  isFailed: boolean;
}
