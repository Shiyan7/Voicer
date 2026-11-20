import { MarkdownBlock, MarkdownInline } from './types/MarkdownBlock';

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[\[[\w\s,:[\]-]+?]])/g;
const CITATION =
  /(?:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}):)?(\d+)/gi;
const BULLET_PREFIX = /^\s*[-*•]\s+/;

const toTimes = (token: string): MarkdownInline[] => {
  const times = [...token.matchAll(CITATION)].map(
    ([, meetingId, ms]): MarkdownInline => ({
      kind: 'time',
      ms: Number(ms),
      meetingId: meetingId?.toLowerCase(),
    }),
  );
  return times.length ? times : [{ kind: 'text', text: token }];
};

const toInlines = (token: string): MarkdownInline[] => {
  if (token.startsWith('[[')) return toTimes(token);
  if (token.startsWith('**')) {
    return [{ kind: 'bold', text: token.slice(2, -2) }];
  }
  if (token.startsWith('`')) {
    return [{ kind: 'code', text: token.slice(1, -1) }];
  }
  return [{ kind: 'text', text: token }];
};

const parseInlines = (line: string): MarkdownInline[] =>
  line.split(INLINE_PATTERN).filter(Boolean).flatMap(toInlines);

const toBlock = (line: string): MarkdownBlock => ({
  isBullet: BULLET_PREFIX.test(line),
  inlines: parseInlines(line.replace(BULLET_PREFIX, '').trim()),
});

export const parseMarkdown = (content: string): MarkdownBlock[] =>
  content
    .split('\n')
    .filter((line) => line.trim())
    .map(toBlock);
