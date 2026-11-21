import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { MeetingContentService } from '../../meetings/meeting-content.service';
import {
  buildMeetingQuestionsPrompt,
  QUESTIONS_RESPONSE_SCHEMA,
} from '../prompts/meeting-questions.prompt';

@Injectable()
export class MeetingQuestionsService {
  private readonly logger = new Logger(MeetingQuestionsService.name);
  private readonly pending = new Map<string, Promise<string[]>>();

  constructor(
    private readonly content: MeetingContentService,
    private readonly gemini: GeminiService,
  ) {}

  async getSuggestions(userId: string, meetingId: string): Promise<string[]> {
    const meeting = await this.content.findOwned(userId, meetingId);
    if (meeting.suggestedQuestions?.length) return meeting.suggestedQuestions;
    return this.generateOnce(meeting.id);
  }

  private generateOnce(meetingId: string): Promise<string[]> {
    const running = this.pending.get(meetingId);
    if (running) return running;

    const generation = this.generateAndSave(meetingId).finally(() =>
      this.pending.delete(meetingId),
    );
    this.pending.set(meetingId, generation);
    return generation;
  }

  private async generateAndSave(meetingId: string): Promise<string[]> {
    try {
      const segments = await this.content.getSegments(meetingId);
      if (!segments.length) return [];

      const parsed = await this.gemini.generateJson<{ questions?: string[] }>(
        buildMeetingQuestionsPrompt(segments),
        QUESTIONS_RESPONSE_SCHEMA,
        (generated) => Boolean(generated.questions?.length),
      );
      const suggestedQuestions = parsed.questions ?? [];
      await this.content.saveSuggestedQuestions(meetingId, suggestedQuestions);
      return suggestedQuestions;
    } catch {
      this.logger.warn(`Failed to suggest questions for ${meetingId}`);
      return [];
    }
  }
}
