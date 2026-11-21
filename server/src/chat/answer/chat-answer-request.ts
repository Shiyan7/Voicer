import { LlmTurn } from '../../llm/llm-turn';

export interface ChatAnswerRequest {
  userId: string;
  turns: LlmTurn[];
  signal: AbortSignal;
}
