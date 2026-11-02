import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { buildDateRangeCondition } from '../common/listing/build-date-range-condition';
import { findPage } from '../common/listing/find-page';
import { requireText } from '../common/require-text';
import { MeetingsService } from '../meetings/meetings.service';
import { FileStorageService } from '../file/file-storage.service';
import { FileUpload } from '../file/file-upload';
import { ClaudeService } from '../claude/claude.service';
import { InterviewLanguage } from './interview-language.enum';
import { InterviewMode } from './interview-mode.enum';
import { InterviewPrepStatus } from './interview-prep-status.enum';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewSessionStatus } from './interview-session-status.enum';
import { InterviewSessionsPageInput } from './interview-sessions-page.input';
import { InterviewSessionsPageOutput } from './interview-sessions-page.output';
import { InterviewSessionsSort } from './interview-sessions-sort.enum';
import { InterviewTurnEntity } from './interview-turn.entity';
import { InterviewTurnOutput } from './interview-turn.output';
import { InterviewResumeOutput } from './interview-resume.output';
import {
  InterviewPreparation,
  InterviewRecommendations,
} from './interview.types';
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
const RESUME_LOOKBACK = 50;
const MAX_RESUMES = 5;
const EMPTY_RECOMMENDATIONS: InterviewRecommendations = {
  topics: [],
  likelyQuestions: [],
  emphasize: [],
};
const STATUS_CONDITIONS = {
  [InterviewSessionStatus.FINISHED]: Not(IsNull()),
  [InterviewSessionStatus.UNFINISHED]: IsNull(),
};

@Injectable()
export class InterviewSessionsService implements OnModuleInit {
  private readonly logger = new Logger(InterviewSessionsService.name);

  constructor(
    @InjectRepository(InterviewSessionEntity)
    private readonly sessionsRepository: Repository<InterviewSessionEntity>,
    @InjectRepository(InterviewTurnEntity)
    private readonly turnsRepository: Repository<InterviewTurnEntity>,
    private readonly meetings: MeetingsService,
    private readonly claude: ClaudeService,
    private readonly files: FileStorageService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.sessionsRepository.update(
      { prepStatus: InterviewPrepStatus.PREPARING },
      { prepStatus: InterviewPrepStatus.FAILED },
    );
  }

  async create(
    userId: string,
    resume: FileUpload | null,
    resumeSessionId: string | null,
    vacancy: string,
    language: InterviewLanguage,
    mode: InterviewMode,
  ): Promise<InterviewSessionOutput> {
    const vacancyText = requireText(
      vacancy,
      MAX_VACANCY_LENGTH,
      'Некорректный текст вакансии',
    );
    const { resumeText, resumeFileName, resumeUrl } = await this.resolveResume(
      userId,
      resume,
      resumeSessionId,
    );
    const session = await this.sessionsRepository.save(
      this.sessionsRepository.create({
        userId,
        vacancyText,
        resumeText,
        resumeFileName,
        resumeUrl,
        language,
        mode,
        prepStatus: InterviewPrepStatus.PREPARING,
        recommendations: EMPTY_RECOMMENDATIONS,
      }),
    );
    void this.runPreparation(session);
    return toInterviewSessionOutput(session);
  }

  async retryPreparation(
    userId: string,
    id: string,
  ): Promise<InterviewSessionOutput> {
    const session = await this.findOwned(userId, id);
    if (session.prepStatus !== InterviewPrepStatus.FAILED) {
      return toInterviewSessionOutput(session);
    }
    session.prepStatus = InterviewPrepStatus.PREPARING;
    await this.sessionsRepository.save(session);
    void this.runPreparation(session);
    return toInterviewSessionOutput(session);
  }

  async resumes(userId: string): Promise<InterviewResumeOutput[]> {
    const sessions = await this.sessionsRepository.find({
      where: { userId, resumeFileName: Not(IsNull()) },
      order: { createdAt: 'DESC' },
      take: RESUME_LOOKBACK,
    });
    const unique = new Map(
      [...sessions].reverse().map((session) => [session.resumeText, session]),
    );
    return [...unique.values()]
      .reverse()
      .slice(0, MAX_RESUMES)
      .map(({ id, resumeFileName }) => ({
        sessionId: id,
        fileName: resumeFileName,
      }));
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
    await this.removeUnusedResume(userId, session.resumeUrl);
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
    answerDurationMs: number | null = null,
  ): Promise<void> {
    await this.turnsRepository.insert({
      sessionId,
      question,
      answer,
      answerDurationMs,
    });
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
      ...(input.mode && { mode: input.mode }),
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
      toInterviewSessionOutput(
        session,
        bySession.get(session.id),
        this.files.signUrl(session.resumeUrl),
      ),
    );
  }

  private async removeUnusedResume(
    userId: string,
    resumeUrl: string | null,
  ): Promise<void> {
    if (!resumeUrl) return;
    const isUsed = await this.sessionsRepository.existsBy({ resumeUrl });
    if (!isUsed) await this.files.remove(userId, resumeUrl);
  }

  private async resolveResume(
    userId: string,
    resume: FileUpload | null,
    resumeSessionId: string | null,
  ): Promise<{
    resumeText: string;
    resumeFileName: string | null;
    resumeUrl: string | null;
  }> {
    if (resume) {
      const content = await this.readPdf(resume);
      return {
        resumeText: await extractPdfText(content),
        resumeFileName: resume.filename,
        resumeUrl: await this.files.saveBuffer(userId, content, '.pdf'),
      };
    }
    if (!resumeSessionId) throw new BadRequestException('Загрузите резюме');
    const { resumeText, resumeFileName, resumeUrl } = await this.findOwned(
      userId,
      resumeSessionId,
    );
    return { resumeText, resumeFileName, resumeUrl };
  }

  private async runPreparation(session: InterviewSessionEntity): Promise<void> {
    try {
      const preparation = await this.prepare(
        session.resumeText,
        session.vacancyText,
        session.language,
      );
      await this.sessionsRepository.update(session.id, {
        ...preparation,
        prepStatus: InterviewPrepStatus.READY,
      });
    } catch (error) {
      this.logger.error(`Failed to prepare interview ${session.id}`, error);
      await this.sessionsRepository.update(session.id, {
        prepStatus: InterviewPrepStatus.FAILED,
      });
    }
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
}
