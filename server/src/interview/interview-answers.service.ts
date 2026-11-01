import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PubSub } from 'graphql-subscriptions';
import { FileUpload } from '../file/file-upload';
import { readUpload } from '../file/read-upload';
import { GeminiService } from '../gemini/gemini.service';
import { GroqService } from '../groq/groq.service';
import { LlmTurn } from '../llm/llm-turn';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { topic } from '../pubsub/topic';
import { InterviewAnswerOutput } from './interview-answer.output';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionsService } from './interview-sessions.service';
import {
  buildInterviewAnswerInstruction,
  SCREENSHOT_TASK_PROMPT,
  SCREENSHOT_QUESTION_LABEL,
} from './prompts/interview-answer.prompt';

const MAX_QUESTION_LENGTH = 4000;
const MAX_SCREENSHOT_BYTES = 15 * 1024 * 1024;
const MAX_HISTORY = 10;

const interviewAnswerTopic = (sessionId: string): string =>
  topic('interviewAnswer', sessionId);

interface InterviewAnswerPayload {
  interviewAnswer: InterviewAnswerOutput;
}

type AnswerModel = Pick<GroqService | GeminiService, 'streamText'>;

interface AnswerRequest {
  question: string;
  turn: LlmTurn;
  model: AnswerModel;
}

@Injectable()
export class InterviewAnswersService {
  private readonly logger = new Logger(InterviewAnswersService.name);
  private readonly inFlight = new Map<string, AbortController>();

  constructor(
    private readonly sessions: InterviewSessionsService,
    private readonly groq: GroqService,
    private readonly gemini: GeminiService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async ask(
    userId: string,
    sessionId: string,
    question: string,
  ): Promise<string> {
    const text = this.validateQuestion(question);
    const session = await this.sessions.findOwned(userId, sessionId);
    return this.start(session, {
      question: text,
      turn: { role: 'user', text },
      model: this.groq,
    });
  }

  async askScreenshot(
    userId: string,
    sessionId: string,
    upload: FileUpload,
  ): Promise<string> {
    const session = await this.sessions.findOwned(userId, sessionId);
    const image = await this.readScreenshot(upload);
    return this.start(session, {
      question: SCREENSHOT_QUESTION_LABEL,
      turn: {
        role: 'user',
        text: SCREENSHOT_TASK_PROMPT,
        images: [{ mimeType: upload.mimetype, data: image.toString('base64') }],
      },
      model: this.gemini,
    });
  }

  async subscribe(
    userId: string,
    sessionId: string,
  ): Promise<AsyncIterator<InterviewAnswerPayload>> {
    await this.sessions.findOwned(userId, sessionId);
    return this.pubSub.asyncIterableIterator<InterviewAnswerPayload>(
      interviewAnswerTopic(sessionId),
    );
  }

  private start(
    session: InterviewSessionEntity,
    request: AnswerRequest,
  ): string {
    this.inFlight.get(session.id)?.abort();
    const controller = new AbortController();
    this.inFlight.set(session.id, controller);

    const answer: InterviewAnswerOutput = {
      answerId: randomUUID(),
      question: request.question,
      text: '',
      done: false,
    };
    void this.stream(session, answer, request, controller);
    return answer.answerId;
  }

  private async stream(
    session: InterviewSessionEntity,
    answer: InterviewAnswerOutput,
    request: AnswerRequest,
    controller: AbortController,
  ): Promise<void> {
    let text = '';
    try {
      await request.model.streamText(
        await this.buildInstruction(session),
        [request.turn],
        (partial) => {
          text = partial;
          return this.publish(session.id, { ...answer, text });
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        this.logger.error(`Failed to answer in interview ${session.id}`, error);
      }
    }
    await this.finish(session.id, { ...answer, text, done: true }, controller);
  }

  private async finish(
    sessionId: string,
    answer: InterviewAnswerOutput,
    controller: AbortController,
  ): Promise<void> {
    if (this.inFlight.get(sessionId) === controller) {
      this.inFlight.delete(sessionId);
    }
    await this.publish(sessionId, answer);
    if (!controller.signal.aborted && answer.text.trim()) {
      await this.sessions.addTurn(sessionId, answer.question, answer.text);
    }
  }

  private async buildInstruction(
    session: InterviewSessionEntity,
  ): Promise<string> {
    return buildInterviewAnswerInstruction({
      cheatSheet: session.cheatSheet,
      vacancyText: session.vacancyText,
      history: await this.sessions.recentTurns(session.id, MAX_HISTORY),
    });
  }

  private async publish(
    sessionId: string,
    answer: InterviewAnswerOutput,
  ): Promise<void> {
    await this.pubSub.publish(interviewAnswerTopic(sessionId), {
      interviewAnswer: answer,
    });
  }

  private readScreenshot(upload: FileUpload): Promise<Buffer> {
    if (!upload.mimetype.startsWith('image/')) {
      throw new BadRequestException('Скриншот должен быть изображением');
    }
    return readUpload(upload, MAX_SCREENSHOT_BYTES);
  }

  private validateQuestion(question: string): string {
    const text = question.trim();
    if (!text || text.length > MAX_QUESTION_LENGTH) {
      throw new BadRequestException('Некорректный вопрос');
    }
    return text;
  }
}
