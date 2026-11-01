import { CODE_KEYWORDS } from '../config/CODE_KEYWORDS';
import { CodeToken, CodeTokenKind } from '../types/CodeToken';

const TOKEN_PATTERN =
  /(\/\/[^\n]*|'[^'\n]*'|"[^"\n]*"|`[^`]*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b)/g;
const KEYWORDS = new Set(CODE_KEYWORDS);

const toKind = (token: string, next: string): CodeTokenKind => {
  if (token.startsWith('//')) return 'comment';
  if (/^['"`]/.test(token)) return 'string';
  if (/^\d/.test(token)) return 'number';
  if (KEYWORDS.has(token)) return 'keyword';
  if (/^[A-Z]/.test(token)) return 'type';
  if (/^\w/.test(token) && next.startsWith('(')) return 'call';
  return 'plain';
};

export const highlightCode = (code: string): CodeToken[] => {
  const parts = code.split(TOKEN_PATTERN).filter(Boolean);
  return parts.map((text, index) => ({
    kind: toKind(text, parts[index + 1] ?? ''),
    text,
  }));
};
