import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MeetingEntity } from '../meetings/meeting.entity';
import { FileUpload } from '../file/file-upload';
import { ClaudeService } from '../claude/claude.service';
import { InterviewLanguage } from './interview-language.enum';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewTurnEntity } from './interview-turn.entity';
import { InterviewTurnOutput } from './interview-turn.output';
import { InterviewPreparation, InterviewRecording } from './interview.types';
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
    private readonly claude: ClaudeService,
  ) {}

  async create(
    userId: string,
    resume: FileUpload,
    vacancy: string,
    language: InterviewLanguage,
  ): Promise<InterviewSessionOutput> {
    const vacancyText = this.validateVacancy(vacancy);
    const resumeText = await extractPdfText(await this.readPdf(resume));
    const preparation = await this.prepare(resumeText, vacancyText);
    const session = await this.sessionsRepository.save(
      this.sessionsRepository.create({
        userId,
        vacancyText,
        resumeText,
        language,
        ...preparation,
      }),
    );
    return toInterviewSessionOutput(session);
  }

  async get(userId: string, id: string): Promise<InterviewSessionOutput> {
    const [session] = await this.withMeetings([
      await this.findOwned(userId, id),
    ]);
    return session;
  }

  async list(userId: string): Promise<InterviewSessionOutput[]> {
    const sessions = await this.sessionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return this.withMeetings(sessions);
  }

  async update(
    userId: string,
    id: string,
    finished: boolean | undefined,
  ): Promise<InterviewSessionOutput> {
    const session = await this.findOwned(userId, id);
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
    sessions: InterviewSessionEntity[],
  ): Promise<InterviewSessionOutput[]> {
    if (!sessions.length) return [];
    const recordings = await this.meetingsRepository
      .createQueryBuilder('meeting')
      .distinctOn(['meeting.interviewSessionId'])
      .select('meeting.id', 'id')
      .addSelect('meeting.audioUrl', 'audioUrl')
      .addSelect('meeting.interviewSessionId', 'sessionId')
      .where({ interviewSessionId: In(sessions.map(({ id }) => id)) })
      .orderBy('meeting.interviewSessionId')
      .addOrderBy('meeting.durationSec', 'DESC', 'NULLS LAST')
      .getRawMany<InterviewRecording & { sessionId: string }>();
    const bySession = new Map(recordings.map((r) => [r.sessionId, r]));
    return sessions.map((session) =>
      toInterviewSessionOutput(session, bySession.get(session.id)),
    );
  }

  private prepare(
    resumeText: string,
    vacancyText: string,
  ): Promise<InterviewPreparation> {
    return this.claude.generateJson<InterviewPreparation>(
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
