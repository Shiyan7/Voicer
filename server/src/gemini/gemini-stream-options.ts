import { ThinkingLevel } from '@google/genai';

export interface GeminiStreamOptions {
  signal?: AbortSignal;
  thinkingLevel?: ThinkingLevel;
}
