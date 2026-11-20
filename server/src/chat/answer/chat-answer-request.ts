import { LlmTurn } from '../../llm/llm-turn';

export interface ChatAnswerRequest {
  userId: string;
  turns: LlmTurn[];
  onPartial: (content: string) => Promise<void>;
  signal: AbortSignal;
}
