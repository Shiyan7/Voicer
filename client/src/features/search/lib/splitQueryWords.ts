import { MIN_WORD_LENGTH } from '../config/searchConfig';

export function splitQueryWords(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= MIN_WORD_LENGTH);
}
