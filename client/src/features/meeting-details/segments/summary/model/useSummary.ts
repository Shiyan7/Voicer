import { MarkdownBlock } from '@/shared/lib/markdown';

import { SummaryDeps } from '../types/SummaryDeps';

export function useSummary(props: SummaryDeps) {
  const blocks = (): MarkdownBlock[] => [];

  const isEmpty = (): boolean => true;

  return { blocks, isEmpty };
}
