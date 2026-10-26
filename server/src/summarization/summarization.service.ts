import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { TranscribedSegment } from '../transcription/transcription.types';
import { MeetingSummary } from './summarization.types';
import {
  buildSummarizeMeetingPrompt,
  SUMMARY_RESPONSE_SCHEMA,
} from './prompts/summarize-meeting.prompt';

const SUMMARY_MODEL = 'gemini-3-flash-preview';

@Injectable()
export class SummarizationService {
  private readonly logger = new Logger(SummarizationService.name);
  private readonly ai: GoogleGenAI;

  constructor(configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async summarize(segments: TranscribedSegment[]): Promise<MeetingSummary> {
    this.logger.log(
      `Summarizing ${segments.length} segments via ${SUMMARY_MODEL}`,
    );

    const response = await this.ai.models.generateContent({
      model: SUMMARY_MODEL,
      contents: buildSummarizeMeetingPrompt(segments),
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: SUMMARY_RESPONSE_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text ?? '{}') as Partial<MeetingSummary>;

    return {
      keyPoints: parsed.keyPoints ?? [],
      actionItems: parsed.actionItems ?? [],
    };
  }
}
