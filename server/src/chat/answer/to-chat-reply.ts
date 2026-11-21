import { ChatReply } from './chat-reply';
import { parseAnswer } from './parse-answer';

export type CitationFormatter = (content: string) => string;

export const toChatReply = (
  text: string,
  formatCitations: CitationFormatter,
): ChatReply => {
  const { content, followUps } = parseAnswer(text);
  return { content: formatCitations(content), followUps };
};
