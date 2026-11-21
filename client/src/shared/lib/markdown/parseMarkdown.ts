import { MarkdownBlock, MarkdownInline } from './types/MarkdownBlock';

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[\[[\w:-]+]])/g;
const CITATION = /^\[\[(?:([\da-f-]{36}):)?(\d+)]]$/;
const BULLET_PREFIX = /^\s*[-*•]\s+/;

const toTime = (token: string): MarkdownInline => {
  const match = CITATION.exec(token);
  if (!match) return { kind: 'text', text: token };
  const [, meetingId, ms] = match;
  return { kind: 'time', ms: Number(ms), meetingId };
};

const toInline = (token: string): MarkdownInline => {
  if (token.startsWith('[[')) return toTime(token);
  if (token.startsWith('**')) return { kind: 'bold', text: token.slice(2, -2) };
  if (token.startsWith('`')) return { kind: 'code', text: token.slice(1, -1) };
  return { kind: 'text', text: token };
};

const parseInlines = (line: string): MarkdownInline[] =>
  line.split(INLINE_PATTERN).filter(Boolean).map(toInline);

const toBlock = (line: string): MarkdownBlock => ({
  isBullet: BULLET_PREFIX.test(line),
  inlines: parseInlines(line.replace(BULLET_PREFIX, '').trim()),
});

export const parseMarkdown = (content: string): MarkdownBlock[] =>
  content
    .split('\n')
    .filter((line) => line.trim())
    .map(toBlock);
