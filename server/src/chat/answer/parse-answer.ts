import { ChatReply } from './chat-reply';

export const MAX_FOLLOW_UPS = 3;

const MARKER_LINE = /(?:^|\n)\s*-{3,}\s*(?:\n|$)/;

const PARTIAL_MARKER_TAIL = /\n\s*-{1,2}\s*$/;

const LIST_PREFIX = /^[-*\d.\s]+/;

export function parseAnswer(text: string): ChatReply {
  const [answer, followUpsBlock = ''] = text.split(MARKER_LINE);

  return {
    content: answer.replace(PARTIAL_MARKER_TAIL, '').trim(),
    followUps: followUpsBlock
      .split('\n')
      .map((line) => line.replace(LIST_PREFIX, '').trim())
      .filter(Boolean)
      .slice(0, MAX_FOLLOW_UPS),
  };
}
