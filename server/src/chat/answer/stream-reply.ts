import { ChatReply } from './chat-reply';
import { parseAnswer } from './parse-answer';

export type ReplyGenerator = (
  onText: (text: string) => Promise<void>,
) => Promise<string>;

type CitationFormatter = (content: string) => string;

export const toChatReply = (
  text: string,
  formatCitations: CitationFormatter,
): ChatReply => {
  const { content, followUps } = parseAnswer(text);
  return { content: formatCitations(content), followUps };
};

export async function streamReply(
  generate: ReplyGenerator,
  formatCitations: CitationFormatter,
  onPartial: (content: string) => Promise<void>,
): Promise<ChatReply> {
  const text = await generate((partial) =>
    onPartial(toChatReply(partial, formatCitations).content),
  );
  return toChatReply(text, formatCitations);
}
