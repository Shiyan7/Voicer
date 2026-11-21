import { LlmTurn } from '../../llm/llm-turn';
import { ChatThreadEntity } from '../threads/chat-thread.entity';

export type PartialReplyHandler = (content: string) => Promise<void>;

export interface ChatAnswerRequest {
  thread: ChatThreadEntity;
  turns: LlmTurn[];
  signal: AbortSignal;
  onPartial: PartialReplyHandler;
}
