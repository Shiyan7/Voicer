import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiError, GoogleGenAI } from '@google/genai';
import { TranscribedSegment } from '../transcription/transcription.types';
import { MeetingSummary } from './summarization.types';
import {
  buildMeetingTitlePrompt,
  buildSummarizeMeetingPrompt,
  SUMMARY_RESPONSE_SCHEMA,
  TITLE_RESPONSE_SCHEMA,
} from './prompts/summarize-meeting.prompt';
import { SummaryStyle } from './summary-style.enum';

const FREE_TIER_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

const RETRYABLE_STATUSES = [404, 429, 503];

@Injectable()
export class SummarizationService {
  private readonly logger = new Logger(SummarizationService.name);
  private readonly ai: GoogleGenAI;

  constructor(configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async summarize(
    segments: TranscribedSegment[],
    style: SummaryStyle,
  ): Promise<MeetingSummary> {
    this.logger.log(`Summarizing ${segments.length} segments (${style})`);

    const parsed = await this.generateJson<Partial<MeetingSummary>>(
      buildSummarizeMeetingPrompt(segments, style),
      SUMMARY_RESPONSE_SCHEMA,
      (summary) => Boolean(summary.keyPoints?.length),
    );

    return {
      title: (parsed.title ?? '').trim(),
      keyPoints: parsed.keyPoints ?? [],
      actionItems: parsed.actionItems ?? [],
    };
  }

  async generateTitle(segments: TranscribedSegment[]): Promise<string> {
    const parsed = await this.generateJson<{ title?: string }>(
      buildMeetingTitlePrompt(segments),
      TITLE_RESPONSE_SCHEMA,
      (result) => Boolean(result.title?.trim()),
    );

    return (parsed.title ?? '').trim();
  }

  private async generateJson<T>(
    contents: string,
    schema: object,
    isUsable: (result: T) => boolean,
  ): Promise<T> {
    for (const model of FREE_TIER_MODELS) {
      const result = await this.tryModel<T>(model, contents, schema);
      if (result && isUsable(result)) {
        this.logger.log(`Generated with ${model}`);
        return result;
      }
    }

    throw new Error('All Gemini models failed or returned empty output');
  }

  private async tryModel<T>(
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
