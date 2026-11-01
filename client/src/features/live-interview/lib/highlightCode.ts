import { CODE_KEYWORDS } from '../config/liveInterviewConfig';
import { CodeToken, CodeTokenKind } from '../types/CodeToken';

const TOKEN_PATTERN =
  /(\/\/[^\n]*|'[^'\n]*'|"[^"\n]*"|`[^`]*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b)/g;
const KEYWORDS = new Set(CODE_KEYWORDS);

const toKind = (token: string): CodeTokenKind => {
  if (token.startsWith('//')) return 'comment';
  if (/^['"`]/.test(token)) return 'string';
  if (/^\d/.test(token)) return 'number';
  if (KEYWORDS.has(token)) return 'keyword';
  return 'plain';
};

export const highlightCode = (code: string): CodeToken[] =>
  code
    .split(TOKEN_PATTERN)
    .filter(Boolean)
    .map((text) => ({ kind: toKind(text), text }));
