import { toWords } from './has-meaningful-speech';

export function countForeignWords(text: string, spoken: string): number {
  const spokenWords = new Set(toWords(spoken));
  return toWords(text).filter((word) => !spokenWords.has(word)).length;
}

export function isEcho(text: string, spoken: string): boolean {
  return countForeignWords(text, spoken) === 0;
}
