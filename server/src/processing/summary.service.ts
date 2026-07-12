import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ActionItemEntity } from '../meetings/action-item.entity';
import { MeetingEntity } from '../meetings/meeting.entity';
import { TranscriptSpeaker } from '../meetings/transcript-segment.entity';
import { fetchWithRetry } from './fetch-retry';
import { TranscriptSegmentDraft } from './transcription.service';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
/** Gemini 2.0 Flash was shut down on 2026-06-01. */
const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash';

interface SummaryResult {
  title: string;
  summary: string;
  actionItems: string[];
}

const PROMPT_HEADER = `Ты — ассистент, обрабатывающий транскрипт звонка. Реплики помечены: "Я" — пользователь, "Собеседник" — вторая сторона.

Верни СТРОГО JSON-объект следующей формы (без markdown-обёртки, без комментариев):
{"title": string, "summary": string, "actionItems": string[]}

Требования:
- "title": короткое название встречи (до 8 слов) на языке транскрипта.
- "summary": ключевые моменты встречи в markdown (краткие пункты), на языке транскрипта.
- "actionItems": список конкретных задач/договорённостей для пользователя ("Я"), каждая — одна строка на языке транскрипта. Пустой массив, если задач нет.

Транскрипт:
`;

@Injectable()
export class SummaryService {
  private readonly logger = new Logger(SummaryService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Generates title/summary/action items via Gemini and saves them.
   * Old action items of the meeting are replaced (idempotent reprocessing).
   */
  async summarizeAndSave(
    meeting: MeetingEntity,
    segments: TranscriptSegmentDraft[],
  ): Promise<void> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set');
    }

    const transcript = this.renderTranscript(segments);
    const result = await this.generateSummary(transcript, apiKey);

    await this.dataSource.transaction(async (manager) => {
      const meetingPatch: Partial<MeetingEntity> = { summary: result.summary };
      if (!meeting.title || meeting.title.trim().length === 0) {
        meetingPatch.title = result.title.slice(0, 255);
      }
      await manager.update(MeetingEntity, { id: meeting.id }, meetingPatch);

      await manager.delete(ActionItemEntity, { meetingId: meeting.id });
      const items = result.actionItems
        .map((text) => text.trim())
        .filter((text) => text.length > 0)
        .map((text) =>
          manager.create(ActionItemEntity, {
            meetingId: meeting.id,
            userId: meeting.userId,
            text,
          }),
        );
      if (items.length > 0) {
        await manager.save(items);
      }
    });

    this.logger.log(
      `Meeting ${meeting.id}: summary saved, ${result.actionItems.length} action items`,
    );
  }

  /** Empty transcript: no summary to build — clear summary and action items. */
  async clearSummary(meeting: MeetingEntity): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.update(
        MeetingEntity,
        { id: meeting.id },
        { summary: null },
      );
      await manager.delete(ActionItemEntity, { meetingId: meeting.id });
    });
  }

  private renderTranscript(segments: TranscriptSegmentDraft[]): string {
    return segments
      .map((segment) => {
        const speaker =
          segment.speaker === TranscriptSpeaker.ME ? 'Я' : 'Собеседник';
        return `${speaker}: ${segment.text}`;
      })
      .join('\n');
  }

  private async generateSummary(
    transcript: string,
    apiKey: string,
  ): Promise<SummaryResult> {
    // One retry on invalid JSON / unexpected shape.
    let lastError: Error;

    for (let attempt = 0; attempt < 2; attempt++) {
      const text = await this.callGemini(transcript, apiKey);

      try {
        return this.parseSummary(text);
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        this.logger.warn(
          `Gemini returned invalid JSON (attempt ${attempt + 1}/2): ${lastError.message}`,
        );
      }
    }

    throw lastError;
  }

  private async callGemini(
    transcript: string,
    apiKey: string,
  ): Promise<string> {
    const model =
      this.configService.get<string>('GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL;
    const url = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`;

    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT_HEADER + transcript }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    }, {
      // A quota-exhausted request cannot succeed a second later. Retrying it
      // only makes a small upload appear stuck for several additional seconds.
      retryOnRateLimit: false,
    });

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('');

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    return text;
  }

  private parseSummary(text: string): SummaryResult {
    const parsed: unknown = JSON.parse(text);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as SummaryResult).title !== 'string' ||
      typeof (parsed as SummaryResult).summary !== 'string' ||
      !Array.isArray((parsed as SummaryResult).actionItems) ||
      !(parsed as SummaryResult).actionItems.every(
        (item) => typeof item === 'string',
      )
    ) {
      throw new Error('Unexpected summary JSON shape');
    }

    return parsed as SummaryResult;
  }
}

/** The transcript is useful even when the optional LLM summary has no quota. */
export function isGeminiQuotaError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('HTTP 429') ||
      error.message.includes('RESOURCE_EXHAUSTED'))
  );
}
