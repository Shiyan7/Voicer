import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PubSub } from 'graphql-subscriptions';
import { ClaudeService } from '../claude/claude.service';
import { requireText } from '../common/require-text';
import { FileUpload } from '../file/file-upload';
import { readUpload } from '../file/read-upload';
import { GeminiService } from '../gemini/gemini.service';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { topic } from '../pubsub/topic';
import { AnswerRuns } from './answer-runs';
import { InterviewAnswerOutput } from './interview-answer.output';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionsService } from './interview-sessions.service';
import {
  buildInterviewAnswerInstruction,
  SKIP_ANSWER,
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

type AnswerGenerator = (
  instruction: string,
  onText: (text: string) => Promise<void>,
  signal: AbortSignal,
) => Promise<string>;

interface AnswerRequest {
  question: string;
  generate: AnswerGenerator;
}

interface AnswerGate {
  order: number;
  answerId: string;
  controller: AbortController;
  isOpen: boolean;
  settle: (answerId: string | null) => void;
}

@Injectable()
export class InterviewAnswersService {
  private readonly logger = new Logger(InterviewAnswersService.name);
  private readonly runs = new AnswerRuns();

  constructor(
    private readonly sessions: InterviewSessionsService,
    private readonly claude: ClaudeService,
    private readonly gemini: GeminiService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async ask(
    userId: string,
    sessionId: string,
    question: string,
  ): Promise<string> {
    const { session, request } = await this.prepareQuestion(
      userId,
      sessionId,
      question,
    );
    return this.start(session, request);
  }

  async askIfExpected(
    userId: string,
    sessionId: string,
    question: string,
  ): Promise<string | null> {
    const { session, request } = await this.prepareQuestion(
      userId,
      sessionId,
      question,
    );
    const answer = this.createAnswer(request.question);
    const controller = new AbortController();
    return new Promise((settle) => {
      const gate: AnswerGate = {
        order: this.runs.nextOrder(),
        answerId: answer.answerId,
        controller,
        isOpen: false,
        settle,
      };
      void this.stream(session, answer, request, controller, gate);
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
      generate: (instruction, onText, signal) =>
        this.gemini.streamText(
          instruction,
          [
            {
              role: 'user',
              text: SCREENSHOT_TASK_PROMPT,
              images: [
                { mimeType: upload.mimetype, data: image.toString('base64') },
              ],
            },
          ],
          onText,
          signal,
        ),
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

  release(sessionId: string): void {
    this.runs.release(sessionId);
  }

  private async prepareQuestion(
    userId: string,
    sessionId: string,
    question: string,
  ): Promise<{ session: InterviewSessionEntity; request: AnswerRequest }> {
    const text = requireText(
      question,
      MAX_QUESTION_LENGTH,
      'Некорректный вопрос',
    );
    const session = await this.sessions.findOwned(userId, sessionId);
    return {
      session,
      request: {
        question: text,
        generate: (instruction, onText, signal) =>
          this.claude.streamText(instruction, text, onText, signal),
      },
    };
  }

  private createAnswer(question: string): InterviewAnswerOutput {
    return { answerId: randomUUID(), question, text: '', done: false };
  }

  private start(
    session: InterviewSessionEntity,
    request: AnswerRequest,
  ): string {
    const controller = new AbortController();
    this.runs.claim(session.id, controller, this.runs.nextOrder());
    const answer = this.createAnswer(request.question);
    void this.stream(session, answer, request, controller);
    return answer.answerId;
  }

  private tryOpenGate(
    sessionId: string,
    gate: AnswerGate,
    partial: string,
  ): boolean {
    const head = partial.trimStart();
    if (SKIP_ANSWER.startsWith(head)) return false;
    if (
      head.startsWith(SKIP_ANSWER) ||
      this.runs.isStale(sessionId, gate.order)
    ) {
      gate.controller.abort();
      return false;
    }
    gate.isOpen = true;
    this.runs.claim(sessionId, gate.controller, gate.order);
    gate.settle(gate.answerId);
    return true;
  }

  private async stream(
    session: InterviewSessionEntity,
    answer: InterviewAnswerOutput,
    request: AnswerRequest,
    controller: AbortController,
    gate?: AnswerGate,
  ): Promise<void> {
    let text = '';
    const untrack = this.runs.track(session.id, controller);
    try {
      await request.generate(
        await this.buildInstruction(session, !!gate),
        async (partial) => {
          const isBlocked =
            gate &&
            !gate.isOpen &&
            !this.tryOpenGate(session.id, gate, partial);
          if (isBlocked) return;
          text = partial;
          await this.publish(session.id, { ...answer, text });
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        this.logger.error(`Failed to answer in interview ${session.id}`, error);
      }
    }
    untrack();
    if (gate && !gate.isOpen) {
      gate.settle(null);
      return;
    }
    await this.finish(session.id, { ...answer, text, done: true }, controller);
  }

  private async finish(
    sessionId: string,
    answer: InterviewAnswerOutput,
    controller: AbortController,
  ): Promise<void> {
    this.runs.complete(sessionId, controller);
    await this.publish(sessionId, answer);
    if (!controller.signal.aborted && answer.text.trim()) {
      await this.sessions.addTurn(sessionId, answer.question, answer.text);
    }
  }

  private async buildInstruction(
    session: InterviewSessionEntity,
    isGated: boolean,
  ): Promise<string> {
    return buildInterviewAnswerInstruction({
      language: session.language,
      cheatSheet: session.cheatSheet,
      vacancyText: session.vacancyText,
      history: await this.sessions.recentTurns(session.id, MAX_HISTORY),
      isGated,
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
}
