import type { MarkdownBlock } from '@/shared/lib/markdown';

export interface LiveTurnView {
  id: string;
  question: string;
  isQuestionLive: boolean;
  short?: MarkdownBlock[];
  details?: MarkdownBlock[];
  code: string;
  codeLanguage: string;
  toggleLabel: string;
  isExpanded: boolean;
}
