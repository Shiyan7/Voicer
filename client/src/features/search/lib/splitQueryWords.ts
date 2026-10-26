const MIN_WORD_LENGTH = 2;

export function splitQueryWords(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= MIN_WORD_LENGTH);
}
