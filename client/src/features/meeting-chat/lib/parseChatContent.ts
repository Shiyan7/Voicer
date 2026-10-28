import { ChatBlock, ChatInline } from '../types/ChatBlock';

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[\[\d+\]\])/g;
const BULLET_PREFIX = /^\s*[-*•]\s+/;

const toTime = (token: string): ChatInline => ({
  kind: 'time',
  ms: Number(token.slice(2, -2)),
});

const toInlines = (token: string): ChatInline[] => {
  if (token.startsWith('[[')) return [toTime(token)];
  if (token.startsWith('**')) {
    return [{ kind: 'bold', text: token.slice(2, -2) }];
  }
  if (token.startsWith('`')) {
    return [{ kind: 'code', text: token.slice(1, -1) }];
  }
  return [{ kind: 'text', text: token }];
};

const parseInlines = (line: string): ChatInline[] =>
  line.split(INLINE_PATTERN).filter(Boolean).flatMap(toInlines);

const toBlock = (line: string): ChatBlock => ({
  isBullet: BULLET_PREFIX.test(line),
  inlines: parseInlines(line.replace(BULLET_PREFIX, '').trim()),
});

export const parseChatContent = (content: string): ChatBlock[] =>
  content
    .split('\n')
    .filter((line) => line.trim())
    .map(toBlock);
