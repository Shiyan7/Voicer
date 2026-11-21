import { ChatReply } from './chat-reply';
import { CitationFormatter, toChatReply } from './to-chat-reply';

export type ReplyGenerator = (
  onText: (text: string) => Promise<void>,
) => Promise<string>;

export type PartialReplyHandler = (content: string) => Promise<void>;

export async function streamReply(
  generate: ReplyGenerator,
  formatCitations: CitationFormatter,
  onPartial: PartialReplyHandler,
): Promise<ChatReply> {
  const text = await generate((partial) =>
    onPartial(toChatReply(partial, formatCitations).content),
  );
  return toChatReply(text, formatCitations);
}
