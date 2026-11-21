import { ChatThreadEntity } from './chat-thread.entity';
import { ChatThreadOutput } from './chat-thread.output';

export const toChatThreadOutput = ({
  id,
  meetingId,
  title,
  pinnedAt,
}: ChatThreadEntity): ChatThreadOutput => ({
  id,
  meetingId,
  title,
  isPinned: Boolean(pinnedAt),
});
