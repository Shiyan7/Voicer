import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PubSub } from 'graphql-subscriptions';
import { GeminiService } from '../gemini/gemini.service';
import { GroqService } from '../groq/groq.service';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { InterviewAnswerOutput } from './interview-answer.output';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionsService } from './interview-sessions.service';
import {
  buildInterviewAnswerInstruction,
  SCREENSHOT_TASK_PROMPT,
  SCREENSHOT_QUESTION_LABEL,
} from './prompts/interview-answer.prompt';

const MAX_QUESTION_LENGTH = 4000;
const MAX_HISTORY_LINES = 20;

const interviewAnswerTopic = (sessionId: string): string =>
  `interviewAnswer.${sessionId}`;

interface InterviewAnswerPayload {
  interviewAnswer: InterviewAnswerOutput;
}

type AnswerGenerator = (
  instruction: string,
  onText: (text: string) => Promise<void>,
  signal: AbortSignal,
) => Promise<string>;

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
    history: string[],
  ): Promise<string> {
    const text = this.validateQuestion(question);
    const session = await this.sessions.findOwned(userId, sessionId);
    return this.start(session, text, history, (instruction, onText, signal) =>
      this.groq.streamText(
        instruction,
        [{ role: 'user', text }],
        onText,
        signal,
      ),
    );
  }

  async askScreenshot(
    userId: string,
    sessionId: string,
    image: Buffer,
    history: string[],
  ): Promise<string> {
    const session = await this.sessions.findOwned(userId, sessionId);
    const turn = {
      role: 'user' as const,
      text: SCREENSHOT_TASK_PROMPT,
      images: [{ mimeType: 'image/png', data: image.toString('base64') }],
    };
    return this.start(
      session,
      SCREENSHOT_QUESTION_LABEL,
      history,
      (instruction, onText, signal) =>
        this.gemini.streamText(instruction, [turn], onText, signal),
    );
  }

  private start(
    session: InterviewSessionEntity,
    question: string,
    history: string[],
    generate: AnswerGenerator,
  ): string {
    this.inFlight.get(session.id)?.abort();
    const controller = new AbortController();
    this.inFlight.set(session.id, controller);

    const answer: InterviewAnswerOutput = {
      answerId: randomUUID(),
      question,
      text: '',
      done: false,
    };
    void this.stream(session, answer, history, generate, controller);
    return answer.answerId;
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

  private async stream(
    session: InterviewSessionEntity,
    answer: InterviewAnswerOutput,
    history: string[],
    generate: AnswerGenerator,
    controller: AbortController,
  ): Promise<void> {
    let text = '';
    try {
      await generate(
        this.buildInstruction(session, history),
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

    if (this.inFlight.get(session.id) === controller) {
      this.inFlight.delete(session.id);
    }
    await this.publish(session.id, { ...answer, text, done: true });
    if (!controller.signal.aborted && text.trim()) {
      await this.sessions.addTurn(session.id, answer.question, text);
    }
  }

  private buildInstruction(
    session: InterviewSessionEntity,
    history: string[],
  ): string {
    return buildInterviewAnswerInstruction({
      cheatSheet: session.cheatSheet,
      vacancyText: session.vacancyText,
      history: history.slice(-MAX_HISTORY_LINES),
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

  private validateQuestion(question: string): string {
    const text = question.trim();
    if (!text || text.length > MAX_QUESTION_LENGTH) {
      throw new BadRequestException('Некорректный вопрос');
    }
    return text;
  }
}
