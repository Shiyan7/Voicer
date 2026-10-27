import type { SearchResultOutput } from '@schema';

import { getMeetingTitle } from '@/entities/meeting';
import { formatRelativeTime } from '@/shared/lib/time';

import { SearchResultView } from '../types/SearchResultView';
import { buildSnippet } from './buildSnippet';
import { getMatchHref } from './getMatchHref';
import { getMatchIcon } from './getMatchIcon';

export function mapSearchResult(
  result: SearchResultOutput,
  words: string[],
): SearchResultView {
  return {
    meetingId: result.meetingId,
    href: getMatchHref(result),
    title: getMeetingTitle(result),
    icon: getMatchIcon(result.kind),
    snippet: buildSnippet(result.text, words),
    dateLabel: formatRelativeTime(result.startedAt),
  };
}
