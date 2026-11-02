import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { buildDateRangeCondition } from '../common/listing/build-date-range-condition';
import { findPage } from '../common/listing/find-page';
import { MeetingsService } from '../meetings/meetings.service';
import { FileUpload } from '../file/file-upload';
import { ClaudeService } from '../claude/claude.service';
import { InterviewLanguage } from './interview-language.enum';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewSessionStatus } from './interview-session-status.enum';
import { InterviewSessionsPageInput } from './interview-sessions-page.input';
import { InterviewSessionsPageOutput } from './interview-sessions-page.output';
import { InterviewSessionsSort } from './interview-sessions-sort.enum';
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
const STATUS_CONDITIONS = {
  [InterviewSessionStatus.FINISHED]: Not(IsNull()),
  [InterviewSessionStatus.UNFINISHED]: IsNull(),
};

@Injectable()
export class InterviewSessionsService {
  constructor(
    @InjectRepository(InterviewSessionEntity)
    private readonly sessionsRepository: Repository<InterviewSessionEntity>,
    @InjectRepository(InterviewTurnEntity)
    private readonly turnsRepository: Repository<InterviewTurnEntity>,
    private readonly meetings: MeetingsService,
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
    const preparation = await this.prepare(resumeText, vacancyText, language);
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

  async page(
    userId: string,
    input: InterviewSessionsPageInput,
  ): Promise<InterviewSessionsPageOutput> {
    const { items, meta } = await findPage(this.sessionsRepository, input, {
      where: this.buildPageWhere(userId, input),
      order: {
        createdAt:
          input.sort === InterviewSessionsSort.DATE_ASC ? 'ASC' : 'DESC',
      },
    });
    return { items: await this.withMeetings(items), meta };
  }

  async finish(userId: string, id: string): Promise<InterviewSessionOutput> {
    const session = await this.findOwned(userId, id);
    session.finishedAt ??= new Date();
    await this.sessionsRepository.save(session);
    return this.get(userId, id);
  }

  async delete(userId: string, id: string): Promise<InterviewSessionOutput> {
    const session = await this.findOwned(userId, id);
    const deleted = toInterviewSessionOutput(session);
    await this.meetings.deleteInterviewRecordings(userId, id);
    await this.sessionsRepository.remove(session);
    return deleted;
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

  private buildPageWhere(
    userId: string,
    input: InterviewSessionsPageInput,
  ): FindOptionsWhere<InterviewSessionEntity> {
    const createdAt = buildDateRangeCondition(input.from, input.to);
    return {
      userId,
      ...(createdAt && { createdAt }),
      ...(input.status && { finishedAt: STATUS_CONDITIONS[input.status] }),
    };
  }

  private async withMeetings(
    sessions: InterviewSessionEntity[],
  ): Promise<InterviewSessionOutput[]> {
    if (!sessions.length) return [];
    const recordings = await this.meetings.findInterviewRecordings(
      sessions.map(({ id }) => id),
    );
    const bySession = new Map(recordings.map((r) => [r.sessionId, r]));
    return sessions.map((session) =>
      toInterviewSessionOutput(session, bySession.get(session.id)),
    );
  }

  private prepare(
    resumeText: string,
    vacancyText: string,
    language: InterviewLanguage,
  ): Promise<InterviewPreparation> {
    return this.claude.generateJson<InterviewPreparation>(
      buildInterviewPreparationPrompt(resumeText, vacancyText, language),
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
