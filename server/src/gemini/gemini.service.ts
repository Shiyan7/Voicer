import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiError, Content, GoogleGenAI } from '@google/genai';
import { LlmTurn } from '../llm/llm-turn';

const FREE_TIER_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

const FREE_TIER_SPEECH_MODELS = [
  'gemini-3.8-flash-tts',
  'gemini-3.8-flash-lite-tts',
  'gemini-3.1-flash-tts-preview',
  'gemini-2.5-flash-preview-tts',
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
    turns: LlmTurn[],
    onText: (text: string) => Promise<void>,
    signal?: AbortSignal,
  ): Promise<string> {
    const contents = turns.map(this.toContent);

    for (const model of FREE_TIER_MODELS) {
      const text = await this.tryStream(
        model,
        systemInstruction,
        contents,
        onText,
        signal,
      );
      if (text) {
        this.logger.log(`Streamed with ${model}`);
        return text;
      }
    }

    throw new Error('All Gemini models failed or returned empty output');
  }

  async synthesizeSpeech(
    text: string,
    voiceName: string,
    signal?: AbortSignal,
  ): Promise<Buffer> {
    for (const model of FREE_TIER_SPEECH_MODELS) {
      const audio = await this.trySpeech(model, text, voiceName, signal);
      if (audio) {
        this.logger.log(`Synthesized with ${model}`);
        return audio;
      }
    }

    throw new Error('All Gemini speech models failed or hit their limits');
  }

  private async trySpeech(
    model: string,
    text: string,
    voiceName: string,
    signal?: AbortSignal,
  ): Promise<Buffer | null> {
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: text,
        config: {
          abortSignal: signal,
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
        },
      });
      const audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      return audio?.data ? Buffer.from(audio.data, 'base64') : null;
    } catch (error) {
      if (!this.isRetryable(error)) throw error;
      this.logger.warn(`${model} unavailable (${this.statusOf(error)})`);
      return null;
    }
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
    signal?: AbortSignal,
  ): Promise<string | null> {
    let text = '';

    try {
      const stream = await this.ai.models.generateContentStream({
        model,
        contents,
        config: { systemInstruction, abortSignal: signal },
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

  private toContent(turn: LlmTurn): Content {
    const images = (turn.images ?? []).map((image) => ({
      inlineData: image,
    }));
    return { role: turn.role, parts: [...images, { text: turn.text }] };
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
