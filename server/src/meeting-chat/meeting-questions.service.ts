import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService } from '../gemini/gemini.service';
import { MeetingEntity } from '../meetings/meeting.entity';
import { TranscribedSegment } from '../transcription/transcription.types';
import {
  buildMeetingQuestionsPrompt,
  QUESTIONS_RESPONSE_SCHEMA,
} from './prompts/meeting-questions.prompt';

@Injectable()
export class MeetingQuestionsService {
  private readonly logger = new Logger(MeetingQuestionsService.name);
  private readonly pending = new Map<string, Promise<string[]>>();

  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    private readonly gemini: GeminiService,
  ) {}

  getQuestions(
    meeting: MeetingEntity,
    segments: TranscribedSegment[],
  ): Promise<string[]> {
    if (meeting.suggestedQuestions?.length) {
      return Promise.resolve(meeting.suggestedQuestions);
    }
    if (!segments.length) return Promise.resolve([]);

    const running = this.pending.get(meeting.id);
    if (running) return running;

    const generation = this.generateAndSave(meeting.id, segments).finally(() =>
      this.pending.delete(meeting.id),
    );
    this.pending.set(meeting.id, generation);
    return generation;
  }

  private async generateAndSave(
    meetingId: string,
    segments: TranscribedSegment[],
  ): Promise<string[]> {
    try {
      const parsed = await this.gemini.generateJson<{ questions?: string[] }>(
        buildMeetingQuestionsPrompt(segments),
        QUESTIONS_RESPONSE_SCHEMA,
        (generated) => Boolean(generated.questions?.length),
      );
      const suggestedQuestions = parsed.questions ?? [];
      await this.meetingsRepository.update(meetingId, { suggestedQuestions });
      return suggestedQuestions;
    } catch {
      this.logger.warn(`Failed to suggest questions for ${meetingId}`);
      return [];
    }
  }
}
