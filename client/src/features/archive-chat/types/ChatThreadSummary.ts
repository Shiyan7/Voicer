import type { ChatThreadOutput } from '@schema';

export type ChatThreadSummary = Pick<
  ChatThreadOutput,
  'id' | 'title' | 'isPinned'
>;
