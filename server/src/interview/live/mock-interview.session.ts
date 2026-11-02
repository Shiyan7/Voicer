import { Logger } from '@nestjs/common';
import { listen } from '@deepgram/sdk';
import { RawData, WebSocket } from 'ws';
import { describeError } from '../../common/describe-error';
import {
  InterviewerLine,
  MockInterviewerService,
} from '../mock-interviewer.service';
import { DeepgramLink, DeepgramMessage, DeepgramSocket } from './deepgram-link';
import { countForeignWords, isEcho } from './echo-filter';
import { joinText } from './join-text';
import {
  MIN_BARGE_IN_WORDS,
  MOCK_REACTION_PAUSE_MS,
} from './live-audio.config';
import { MockClientMessage, MockServerMessage } from './live-audio.types';

type MockPhase = 'preparing' | 'speaking' | 'listening';

interface MockInterviewSessionDeps {
  client: WebSocket;
  userId: string;
  sessionId: string;
  interviewer: MockInterviewerService;
}

interface PendingReply {
  controller: AbortController;
  answer: string;
  durationMs: number;
  isPauseOver: boolean;
  line: InterviewerLine | null;
}

export class MockInterviewSession {
  private readonly logger = new Logger(MockInterviewSession.name);
  private readonly deepgram = new DeepgramLink();
  private phase: MockPhase = 'preparing';
  private question = '';
  private committed = '';
  private interim = '';
  private answerStartedAt = 0;
  private answerEndedAt = 0;
  private reply: PendingReply | null = null;
  private pauseTimer: ReturnType<typeof setTimeout> | null = null;
  private isClosed = false;

  constructor(private readonly deps: MockInterviewSessionDeps) {
    deps.client.on('message', (data, isBinary) =>
      this.onClientMessage(data, isBinary),
    );
    deps.client.on('close', () => this.close());
    deps.client.on('error', () => this.close());
  }

  async attach(socket: DeepgramSocket): Promise<void> {
    await this.deepgram.attach(socket, {
      onMessage: (message) => this.onDeepgramMessage(message),
      onClose: () => this.close(),
    });
    if (!this.isClosed) void this.prepareReply();
  }

  fail(message: string): void {
    this.deps.client.close(1011, message);
  }

  close(): void {
    if (this.isClosed) return;
    this.isClosed = true;
    this.cancelReply();
    this.deepgram.close();
    if (this.deps.client.readyState === WebSocket.OPEN) {
      this.deps.client.close(1000);
    }
  }

  private onClientMessage(data: RawData, isBinary: boolean): void {
    const buffer = this.toBuffer(data);
    if (isBinary) {
      this.deepgram.send(buffer);
      return;
    }
    const message = this.parseClientMessage(buffer);
    if (message?.type === 'speechEnded' && this.phase === 'speaking') {
      this.startListening();
    }
  }

  private toBuffer(data: RawData): Buffer {
    if (Buffer.isBuffer(data)) return data;
    if (Array.isArray(data)) return Buffer.concat(data);
    return Buffer.from(data);
  }

  private parseClientMessage(buffer: Buffer): MockClientMessage | null {
    try {
      return JSON.parse(buffer.toString('utf8')) as MockClientMessage;
    } catch {
      return null;
    }
  }

  private startListening(): void {
    this.phase = 'listening';
    this.committed = '';
    this.interim = '';
    this.answerStartedAt = 0;
  }

  private onDeepgramMessage(message: DeepgramMessage): void {
    if (message.type === 'Results') this.onResults(message);
    if (message.type === 'UtteranceEnd') this.onSilence();
  }

  private onResults(result: listen.ListenV1Results): void {
    const text = result.channel.alternatives[0]?.transcript ?? '';
    if (this.phase === 'speaking' && this.isBargeIn(text)) {
      this.send({ type: 'stopSpeaking' });
      this.startListening();
    }
    if (this.phase !== 'listening') return;
    if (!this.committed && isEcho(text, this.question)) return;
    if (result.is_final) {
      this.committed = joinText(this.committed, text);
      this.interim = '';
    } else {
      this.interim = text;
    }
    if (text) this.onSpeech();
  }

  private isBargeIn(text: string): boolean {
    return countForeignWords(text, this.question) >= MIN_BARGE_IN_WORDS;
  }

  private onSpeech(): void {
    this.cancelReply();
    this.answerEndedAt = Date.now();
    this.answerStartedAt ||= this.answerEndedAt;
    this.send({ type: 'transcript', text: this.answerText() });
  }

  private answerText(): string {
    return joinText(this.committed, this.interim);
  }

  private onSilence(): void {
    if (this.phase !== 'listening' || this.reply) return;
    if (this.answerText()) void this.prepareReply(this.answerText());
  }

  private cancelReply(): void {
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = null;
    this.reply?.controller.abort();
    this.reply = null;
  }

  private async prepareReply(answer = ''): Promise<void> {
    const reply: PendingReply = {
      controller: new AbortController(),
      answer,
      durationMs: this.answerEndedAt - this.answerStartedAt,
      isPauseOver: !answer,
      line: null,
    };
    this.reply = reply;
    if (answer) {
      this.pauseTimer = setTimeout(
        () => this.onPauseOver(reply),
        MOCK_REACTION_PAUSE_MS,
      );
    } else {
      this.send({ type: 'thinking' });
    }
    try {
      reply.line = await this.deps.interviewer.nextLine(
        this.deps.userId,
        this.deps.sessionId,
        answer ? { question: this.question, answer } : null,
        reply.controller.signal,
      );
      if (reply.isPauseOver) await this.deliver(reply);
    } catch (error) {
      if (reply.controller.signal.aborted) return;
      this.logger.warn(`Interviewer failed: ${describeError(error)}`);
      this.send({ type: 'interviewerFailed' });
    }
  }

  private onPauseOver(reply: PendingReply): void {
    reply.isPauseOver = true;
    if (reply.line) void this.deliver(reply);
    else this.send({ type: 'thinking' });
  }

  private async deliver(reply: PendingReply): Promise<void> {
    if (this.reply !== reply || !reply.line) return;
    this.reply = null;
    const asked = this.question;
    const { text, language, audio } = reply.line;
    this.question = text;
    this.phase = 'speaking';
    this.send({ type: 'interviewerSpeech', text, language, audio });
    if (!reply.answer) return;
    try {
      await this.deps.interviewer.saveTurn(
        this.deps.sessionId,
        asked,
        reply.answer,
        reply.durationMs,
      );
    } catch (error) {
      this.logger.warn(`Turn not saved: ${describeError(error)}`);
    }
  }

  private send(message: MockServerMessage): void {
    if (this.deps.client.readyState !== WebSocket.OPEN) return;
    this.deps.client.send(JSON.stringify(message));
  }
}
