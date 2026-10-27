import {
  SNIPPET_CONTEXT_BEFORE,
  SNIPPET_MAX_LENGTH,
} from '../config/searchConfig';
import { SnippetPart } from '../types/SnippetPart';

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function findSnippetStart(text: string, firstMatch: number) {
  if (firstMatch <= SNIPPET_CONTEXT_BEFORE) return 0;

  const rough = firstMatch - SNIPPET_CONTEXT_BEFORE;
  const spaceAfter = text.indexOf(' ', rough);

  return spaceAfter === -1 || spaceAfter >= firstMatch ? rough : spaceAfter + 1;
}

export function buildSnippet(text: string, words: string[]): SnippetPart[] {
  if (!words.length) return [{ text, isMatch: false }];

  const matcher = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
  const firstMatch = text.search(matcher);
  const start = findSnippetStart(text, Math.max(0, firstMatch));
  const window = text.slice(start, start + SNIPPET_MAX_LENGTH);
  const prefix = start > 0 ? '…' : '';

  return `${prefix}${window}`
    .split(matcher)
    .filter(Boolean)
    .map((part) => ({
      text: part,
      isMatch: words.some((word) => word.toLowerCase() === part.toLowerCase()),
    }));
}
