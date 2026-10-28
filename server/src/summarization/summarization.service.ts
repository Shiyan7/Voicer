import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { TranscribedSegment } from '../transcription/transcription.types';
import { MeetingSummary } from './summarization.types';
import {
  buildMeetingQuestionsPrompt,
  buildMeetingTitlePrompt,
  QUESTIONS_RESPONSE_SCHEMA,
  buildSummarizeMeetingPrompt,
  SUMMARY_RESPONSE_SCHEMA,
  TITLE_RESPONSE_SCHEMA,
} from './prompts/summarize-meeting.prompt';
import { SummaryStyle } from './summary-style.enum';

@Injectable()
export class SummarizationService {
  private readonly logger = new Logger(SummarizationService.name);

  constructor(private readonly gemini: GeminiService) {}

  async summarize(
    segments: TranscribedSegment[],
    style: SummaryStyle,
  ): Promise<MeetingSummary> {
    this.logger.log(`Summarizing ${segments.length} segments (${style})`);

    const parsed = await this.gemini.generateJson<Partial<MeetingSummary>>(
      buildSummarizeMeetingPrompt(segments, style),
      SUMMARY_RESPONSE_SCHEMA,
      (summary) => Boolean(summary.keyPoints?.length),
    );

    return {
      title: (parsed.title ?? '').trim(),
      keyPoints: parsed.keyPoints ?? [],
      actionItems: parsed.actionItems ?? [],
      suggestedQuestions: parsed.suggestedQuestions ?? [],
    };
  }

  async generateQuestions(segments: TranscribedSegment[]): Promise<string[]> {
    const parsed = await this.gemini.generateJson<{ questions?: string[] }>(
      buildMeetingQuestionsPrompt(segments),
      QUESTIONS_RESPONSE_SCHEMA,
      (result) => Boolean(result.questions?.length),
    );

    return parsed.questions ?? [];
  }

  async generateTitle(segments: TranscribedSegment[]): Promise<string> {
    const parsed = await this.gemini.generateJson<{ title?: string }>(
      buildMeetingTitlePrompt(segments),
      TITLE_RESPONSE_SCHEMA,
      (result) => Boolean(result.title?.trim()),
    );

    return (parsed.title ?? '').trim();
  }
}
