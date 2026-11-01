import { Logger } from '@nestjs/common';
import { DeepgramClient, listen } from '@deepgram/sdk';
import { RawData, WebSocket } from 'ws';
import { InterviewAnswersService } from '../interview-answers.service';
import { InterviewHistoryService } from '../interview-history.service';
import { isLikelyQuestion } from './is-likely-question';
import {
  INTERVIEWER_PREFIX,
  KEEP_ALIVE_INTERVAL_MS,
} from './live-audio.config';
import { LiveClientMessage, LiveServerMessage } from './live-audio.types';

export type DeepgramSocket = Awaited<
  ReturnType<DeepgramClient['listen']['v1']['connect']>
>;

type DeepgramMessage =
  | listen.ListenV1Results
  | listen.ListenV1Metadata
  | listen.ListenV1UtteranceEnd
  | listen.ListenV1SpeechStarted;

export interface LiveAudioSessionDeps {
  client: WebSocket;
  userId: string;
  sessionId: string;
  answers: InterviewAnswersService;
  history: InterviewHistoryService;
}

const joinText = (...parts: string[]): string =>
  parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');

export class LiveAudioSession {
  private readonly logger = new Logger(LiveAudioSession.name);
  private readonly pending: Buffer[] = [];
  private deepgram: DeepgramSocket | null = null;
  private keepAlive: ReturnType<typeof setInterval> | null = null;
  private utteranceId = 1;
  private committed = '';
  private interim = '';
  private lastUtterance = { id: 0, text: '' };
  private isClosed = false;

  constructor(private readonly deps: LiveAudioSessionDeps) {
    deps.client.on('message', (data, isBinary) =>
      this.onClientMessage(data, isBinary),
    );
    deps.client.on('close', () => this.close());
    deps.client.on('error', () => this.close());
  }

  async attach(connect: () => Promise<DeepgramSocket>): Promise<void> {
    const socket = await connect();
    socket.on('message', (message) => this.onDeepgramMessage(message));
    socket.on('error', (error) => this.logger.warn(error.message));
    socket.on('close', () => this.close());
    socket.connect();
    await socket.waitForOpen();
    if (this.isClosed) {
      socket.close();
      return;
    }
    this.deepgram = socket;
    this.pending.splice(0).forEach((chunk) => socket.sendMedia(chunk));
    this.keepAlive = setInterval(
      () => this.sendKeepAlive(),
      KEEP_ALIVE_INTERVAL_MS,
    );
  }

  fail(message: string): void {
    this.send({ type: 'error', message });
    this.deps.client.close(1011, message);
  }

  close(): void {
    if (this.isClosed) return;
    this.isClosed = true;
    if (this.keepAlive) clearInterval(this.keepAlive);
    this.pending.length = 0;
    this.deps.history.clear(this.deps.sessionId);
    this.closeDeepgram();
    if (this.deps.client.readyState === WebSocket.OPEN) {
      this.deps.client.close(1000);
    }
  }

  private closeDeepgram(): void {
    const socket = this.deepgram;
    this.deepgram = null;
    if (!socket) return;
    try {
      socket.sendCloseStream({ type: 'CloseStream' });
    } catch {
      this.logger.debug('Deepgram stream already closed');
    }
    socket.close();
  }

  private sendKeepAlive(): void {
    try {
      this.deepgram?.sendKeepAlive({ type: 'KeepAlive' });
    } catch {
      this.logger.debug('Deepgram keep-alive skipped');
    }
  }

  private onClientMessage(data: RawData, isBinary: boolean): void {
    if (isBinary) {
      this.forwardAudio(this.toBuffer(data));
      return;
    }
    const message = this.parseClientMessage(data);
    if (message?.type === 'answerNow') this.answerNow();
  }

  private toBuffer(data: RawData): Buffer {
    if (Buffer.isBuffer(data)) return data;
    if (Array.isArray(data)) return Buffer.concat(data);
    return Buffer.from(data);
  }

  private parseClientMessage(data: RawData): LiveClientMessage | null {
    try {
      return JSON.parse(
        this.toBuffer(data).toString('utf8'),
      ) as LiveClientMessage;
    } catch {
      return null;
    }
  }

  private forwardAudio(chunk: Buffer): void {
    if (!this.deepgram) {
      this.pending.push(chunk);
      return;
    }
    try {
      this.deepgram.sendMedia(chunk);
    } catch {
      this.logger.debug('Deepgram not ready, audio dropped');
    }
  }

  private onDeepgramMessage(message: DeepgramMessage): void {
    if (message.type === 'Results') this.onResults(message);
    if (message.type === 'UtteranceEnd') this.finishUtterance();
  }

  private onResults(result: listen.ListenV1Results): void {
    const text = result.channel.alternatives[0]?.transcript ?? '';
    const isFinal = Boolean(result.is_final);
    const speechFinal = Boolean(result.speech_final);

    if (isFinal) {
      this.committed = joinText(this.committed, text);
      this.interim = '';
    } else {
      this.interim = text;
    }

    const full = joinText(this.committed, this.interim);
    if (full) {
      this.send({
        type: 'transcript',
        utteranceId: this.utteranceId,
        text: full,
        isFinal,
        speechFinal,
      });
    }

    if (speechFinal) this.finishUtterance();
  }

  private finishUtterance(force = false): string {
    const text = joinText(this.committed, this.interim);
    if (!text) return '';
    const id = this.utteranceId;
    this.send({ type: 'utteranceEnd', utteranceId: id });
    this.committed = '';
    this.interim = '';
    this.utteranceId += 1;
    this.lastUtterance = { id, text };
    this.deps.history.append(
      this.deps.sessionId,
      `${INTERVIEWER_PREFIX}: ${text}`,
    );
    if (force || isLikelyQuestion(text)) void this.answer(id, text);
    return text;
  }

  private answerNow(): void {
    if (this.finishUtterance(true)) return;
    if (!this.lastUtterance.text) return;
    void this.answer(this.lastUtterance.id, this.lastUtterance.text);
  }

  private async answer(utteranceId: number, question: string): Promise<void> {
    const { answers, history, userId, sessionId } = this.deps;
    const questionLine = `${INTERVIEWER_PREFIX}: ${question}`;
    const previous = history
      .get(sessionId)
      .filter((line) => line !== questionLine);
    try {
      const answerId = await answers.ask(userId, sessionId, question, previous);
      this.send({ type: 'answerStarted', utteranceId, answerId });
    } catch (error) {
      this.logger.warn(
        `Answer failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private send(message: LiveServerMessage): void {
    if (this.deps.client.readyState !== WebSocket.OPEN) return;
    this.deps.client.send(JSON.stringify(message));
  }
}
