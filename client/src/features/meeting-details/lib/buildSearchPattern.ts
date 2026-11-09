import { TranscriptSearchOptions } from '../types/TranscriptSearchOptions';

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildSearchPattern(
  options: TranscriptSearchOptions,
): RegExp | null {
  const query = options.query.trim();
  if (!query) return null;

  const body = options.wholeWord
    ? `(?<![\\p{L}\\p{N}_])${escapeRegExp(query)}(?![\\p{L}\\p{N}_])`
    : escapeRegExp(query);

  return new RegExp(body, options.matchCase ? 'gu' : 'giu');
}
