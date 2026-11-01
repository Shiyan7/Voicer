import { JSX } from 'solid-js';

import type { MarkdownBlock } from '@/shared/lib/markdown';

export interface MarkdownProps {
  blocks: MarkdownBlock[];
  class?: string;
  renderTime?: (ms: number) => JSX.Element;
}
