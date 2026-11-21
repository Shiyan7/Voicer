import { ChatReply } from './chat-reply';

export const FOLLOW_UPS_MARKER = '---';

export const MAX_FOLLOW_UPS = 3;

export type CitationFormatter = (content: string) => string;

const MARKER_LINE = new RegExp(
  `(?:^|\\n)\\s*${FOLLOW_UPS_MARKER}-*\\s*(?:\\n|$)`,
);

const PARTIAL_MARKER_TAIL = new RegExp(
  `\\n\\s*-{1,${FOLLOW_UPS_MARKER.length - 1}}\\s*$`,
);

const LIST_PREFIX = /^[-*\d.\s]+/;

export function parseAnswer(
  text: string,
  formatCitations: CitationFormatter,
): ChatReply {
  const [answer, followUpsBlock = ''] = text.split(MARKER_LINE);

  return {
    content: formatCitations(answer.replace(PARTIAL_MARKER_TAIL, '').trim()),
    followUps: followUpsBlock
      .split('\n')
      .map((line) => line.replace(LIST_PREFIX, '').trim())
      .filter(Boolean)
      .slice(0, MAX_FOLLOW_UPS),
  };
}
