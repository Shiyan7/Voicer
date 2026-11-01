import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from '../file/file-upload';
import { GeminiService } from '../gemini/gemini.service';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewPreparation } from './interview.types';
import { toInterviewSessionOutput } from './interview.serializer';
import { readUpload } from './read-upload';
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
    private readonly gemini: GeminiService,
  ) {}

  async create(
    userId: string,
    resume: FileUpload,
    vacancy: string,
  ): Promise<InterviewSessionOutput> {
    const vacancyText = this.validateVacancy(vacancy);
    const pdf = await this.readPdf(resume);
    const preparation = await this.prepare(pdf, vacancyText);
    const session = await this.sessionsRepository.save(
      this.sessionsRepository.create({ userId, vacancyText, ...preparation }),
    );
    return toInterviewSessionOutput(session);
  }

  async get(userId: string, id: string): Promise<InterviewSessionOutput> {
    return toInterviewSessionOutput(await this.findOwned(userId, id));
  }

  async findOwned(userId: string, id: string): Promise<InterviewSessionEntity> {
    const session = await this.sessionsRepository.findOneBy({ id, userId });
    if (!session) throw new NotFoundException('Сессия не найдена');
    return session;
  }

  private prepare(
    pdf: Buffer,
    vacancyText: string,
  ): Promise<InterviewPreparation> {
    return this.gemini.generateJson<InterviewPreparation>(
      [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: pdf.toString('base64'),
              },
            },
            { text: buildInterviewPreparationPrompt(vacancyText) },
          ],
        },
      ],
      INTERVIEW_PREPARATION_SCHEMA,
      (preparation) => Boolean(preparation.cheatSheet?.trim()),
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
