import { ChatMessageEntity } from './chat-message.entity';
import { ChatMessageOutput } from './chat-message.output';

export function toChatMessageOutput(
  message: ChatMessageEntity,
  isStreaming = false,
): ChatMessageOutput {
  return {
    id: message.id,
    meetingId: message.meetingId,
    role: message.role,
    content: message.content,
    followUps: message.followUps,
    isStreaming,
    isFailed: message.isFailed,
    createdAt: message.createdAt,
  };
}
