import { ChatReply } from './chat-reply';
import { FOLLOW_UPS_MARKER, MAX_FOLLOW_UPS } from './follow-ups-format';

const MARKER_LINE = new RegExp(
  `(?:^|\\n)\\s*${FOLLOW_UPS_MARKER}-*\\s*(?:\\n|$)`,
);

const PARTIAL_MARKER_TAIL = new RegExp(
  `\\n\\s*-{1,${FOLLOW_UPS_MARKER.length - 1}}\\s*$`,
);

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
