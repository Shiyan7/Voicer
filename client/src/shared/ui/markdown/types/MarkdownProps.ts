import { JSX } from 'solid-js';

import type { MarkdownBlock, MarkdownTime } from '@/shared/lib/markdown';

export interface MarkdownProps {
  blocks: MarkdownBlock[];
  class?: string;
  renderTime?: (time: MarkdownTime) => JSX.Element;
}
