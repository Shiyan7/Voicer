import { ChatThreadEntity } from './chat-thread.entity';
import { ChatThreadOutput } from './chat-thread.output';

export const toChatThreadOutput = ({
  id,
  meetingId,
  title,
}: ChatThreadEntity): ChatThreadOutput => ({ id, meetingId, title });
