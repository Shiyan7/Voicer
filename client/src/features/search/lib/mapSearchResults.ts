import type { SearchResultOutput } from '@schema';

import { getMeetingTitle } from '@/entities/meeting';
import { formatRelativeTime } from '@/shared/lib/time';

import { SearchResultView } from '../types/SearchResultView';
import { buildSnippet } from './buildSnippet';
import { getMatchHref } from './getMatchHref';
import { getMatchIcon } from './getMatchIcon';

export function mapSearchResults(
  results: SearchResultOutput[],
  words: string[],
  activeIndex: number,
): SearchResultView[] {
  return results.map((result, index) => ({
    meetingId: result.meetingId,
    href: getMatchHref(result),
    title: getMeetingTitle(result.source, result.startedAt),
    icon: getMatchIcon(result.kind),
    snippet: buildSnippet(result.text, words),
    dateLabel: formatRelativeTime(result.startedAt),
    isActive: index === activeIndex,
  }));
}
