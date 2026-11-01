import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MeetingEntity } from '../meetings/meeting.entity';
import { FileUpload } from '../file/file-upload';
import { GroqService } from '../groq/groq.service';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewTurnEntity } from './interview-turn.entity';
import { InterviewTurnOutput } from './interview-turn.output';
import { InterviewPreparation } from './interview.types';
import {
  toInterviewSessionOutput,
  toInterviewTurnOutput,
} from './interview.serializer';
import { extractPdfText } from './extract-pdf-text';
import { readUpload } from '../file/read-upload';
import {
  buildInterviewPreparationPrompt,
  INTERVIEW_PREPARATION_SCHEMA,
} from './prompts/interview-preparation.prompt';

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const MAX_VACANCY_LENGTH = 20000;

@Injectable()
export class InterviewSessionsService {
  constructor(
    @InjectRepository(InterviewSessionEntity)
    private readonly sessionsRepository: Repository<InterviewSessionEntity>,
    @InjectRepository(InterviewTurnEntity)
    private readonly turnsRepository: Repository<InterviewTurnEntity>,
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    private readonly groq: GroqService,
  ) {}

  async create(
    userId: string,
    resume: FileUpload,
    vacancy: string,
  ): Promise<InterviewSessionOutput> {
    const vacancyText = this.validateVacancy(vacancy);
    const resumeText = await extractPdfText(await this.readPdf(resume));
    const preparation = await this.prepare(resumeText, vacancyText);
    const session = await this.sessionsRepository.save(
      this.sessionsRepository.create({
        userId,
        vacancyText,
        resumeText,
        ...preparation,
      }),
    );
    return toInterviewSessionOutput(session, null);
  }

  async get(userId: string, id: string): Promise<InterviewSessionOutput> {
    const [session] = await this.withMeetings(userId, [
      await this.findOwned(userId, id),
    ]);
    return session;
  }

  async list(userId: string): Promise<InterviewSessionOutput[]> {
    const sessions = await this.sessionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return this.withMeetings(userId, sessions);
  }

  async update(
    userId: string,
    id: string,
    recordingStartedAt: Date | undefined,
    finished: boolean | undefined,
  ): Promise<InterviewSessionOutput> {
    const session = await this.findOwned(userId, id);
    if (recordingStartedAt) session.recordingStartedAt = recordingStartedAt;
    if (finished) session.finishedAt ??= new Date();
    await this.sessionsRepository.save(session);
    return this.get(userId, id);
  }

  async turns(
    userId: string,
    sessionId: string,
  ): Promise<InterviewTurnOutput[]> {
    await this.findOwned(userId, sessionId);
    const turns = await this.turnsRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
    return turns.map(toInterviewTurnOutput);
  }

  async addTurn(
    sessionId: string,
    question: string,
    answer: string,
  ): Promise<void> {
    await this.turnsRepository.insert({ sessionId, question, answer });
  }

  async recentTurns(
    sessionId: string,
    limit: number,
  ): Promise<InterviewTurnEntity[]> {
    const turns = await this.turnsRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return turns.reverse();
  }

  async findOwned(userId: string, id: string): Promise<InterviewSessionEntity> {
    const session = await this.sessionsRepository.findOneBy({ id, userId });
    if (!session) throw new NotFoundException('Сессия не найдена');
    return session;
  }

  private async withMeetings(
    userId: string,
    sessions: InterviewSessionEntity[],
  ): Promise<InterviewSessionOutput[]> {
    const recordingStarts = sessions
      .map((session) => session.recordingStartedAt)
      .filter((startedAt): startedAt is Date => startedAt !== null);
    const meetings = recordingStarts.length
      ? await this.meetingsRepository.find({
          select: { id: true, startedAt: true },
          where: { userId, startedAt: In(recordingStarts) },
        })
      : [];
    const meetingIdByStart = new Map(
      meetings.map((meeting) => [meeting.startedAt.getTime(), meeting.id]),
    );
    return sessions.map((session) =>
      toInterviewSessionOutput(
        session,
        meetingIdByStart.get(session.recordingStartedAt?.getTime() ?? 0) ??
          null,
      ),
    );
  }

  private prepare(
    resumeText: string,
    vacancyText: string,
  ): Promise<InterviewPreparation> {
    return this.groq.generateJson<InterviewPreparation>(
      buildInterviewPreparationPrompt(resumeText, vacancyText),
      INTERVIEW_PREPARATION_SCHEMA,
    );
  }

  private readPdf(upload: FileUpload): Promise<Buffer> {
    if (upload.mimetype !== 'application/pdf') {
      throw new BadRequestException('Резюме должно быть в PDF');
    }
    return readUpload(upload, MAX_RESUME_BYTES);
  }

  private validateVacancy(vacancy: string): string {
    const text = vacancy.trim();
    if (!text || text.length > MAX_VACANCY_LENGTH) {
      throw new BadRequestException('Некорректный текст вакансии');
    }
    return text;
  }
}
