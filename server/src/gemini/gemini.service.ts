import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiError, Content, GoogleGenAI } from '@google/genai';
import { GeminiTurn } from './gemini.types';

const FREE_TIER_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

const RETRYABLE_STATUSES = [404, 429, 503];

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly ai: GoogleGenAI;

  constructor(configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async generateJson<T>(
    contents: string,
    schema: object,
    isUsable: (result: T) => boolean,
  ): Promise<T> {
    for (const model of FREE_TIER_MODELS) {
      const result = await this.tryJson<T>(model, contents, schema);
      if (result && isUsable(result)) {
        this.logger.log(`Generated with ${model}`);
        return result;
      }
    }

    throw new Error('All Gemini models failed or returned empty output');
  }

  async streamText(
    systemInstruction: string,
    turns: GeminiTurn[],
    onText: (text: string) => Promise<void>,
  ): Promise<string> {
    const contents = turns.map(this.toContent);

    for (const model of FREE_TIER_MODELS) {
      const text = await this.tryStream(
        model,
        systemInstruction,
        contents,
        onText,
      );
      if (text) {
        this.logger.log(`Streamed with ${model}`);
        return text;
      }
    }

    throw new Error('All Gemini models failed or returned empty output');
  }

  private async tryJson<T>(
    model: string,
    contents: string,
    schema: object,
  ): Promise<T | null> {
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: schema,
        },
      });
      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        this.logger.warn(`${model} blocked the prompt (${blockReason})`);
        return null;
      }
      return JSON.parse(response.text || '{}') as T;
    } catch (error) {
      if (!this.isRetryable(error)) throw error;
      this.logger.warn(`${model} unavailable (${this.statusOf(error)})`);
      return null;
    }
  }

  private async tryStream(
    model: string,
    systemInstruction: string,
    contents: Content[],
    onText: (text: string) => Promise<void>,
  ): Promise<string | null> {
    let text = '';

    try {
      const stream = await this.ai.models.generateContentStream({
        model,
        contents,
        config: { systemInstruction },
      });
      for await (const chunk of stream) {
        if (!chunk.text) continue;
        text += chunk.text;
        await onText(text);
      }
      return text;
    } catch (error) {
      if (text || !this.isRetryable(error)) throw error;
      this.logger.warn(`${model} unavailable (${this.statusOf(error)})`);
      return null;
    }
  }

  private toContent(turn: GeminiTurn): Content {
    return { role: turn.role, parts: [{ text: turn.text }] };
  }

  private isRetryable(error: unknown): boolean {
    return (
      error instanceof SyntaxError ||
      (error instanceof ApiError && RETRYABLE_STATUSES.includes(error.status))
    );
  }

  private statusOf(error: unknown): string {
    return error instanceof ApiError ? String(error.status) : 'invalid JSON';
  }
}
