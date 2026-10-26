import type { IconName } from '@/shared/ui/icon';

import { SnippetPart } from './SnippetPart';

export interface SearchResultView {
  meetingId: string;
  href: string;
  title: string;
  icon: IconName;
  snippet: SnippetPart[];
  dateLabel: string;
  isActive: boolean;
}
