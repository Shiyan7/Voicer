import { LlmTurn } from './llm-turn';

export interface LlmTextModel {
  streamText(
    systemInstruction: string,
    turns: LlmTurn[],
    onText: (text: string) => Promise<void>,
    signal?: AbortSignal,
  ): Promise<string>;
}
