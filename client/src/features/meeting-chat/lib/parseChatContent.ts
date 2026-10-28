import { formatClockMs } from '@/shared/lib/time';

import { ChatBlock, ChatInline } from '../types/ChatBlock';

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[\[[\d\s,[\]]+\]\])/g;
const BULLET_PREFIX = /^\s*[-*•]\s+/;
const NUMBER_PATTERN = /\d+/g;

const toTimes = (token: string): ChatInline[] =>
  (token.match(NUMBER_PATTERN) ?? []).map((value) => ({
    kind: 'time',
    ms: Number(value),
    label: formatClockMs(Number(value)),
  }));

const toInlines = (token: string): ChatInline[] => {
  if (token.startsWith('[[')) return toTimes(token);
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
