import { Logger } from '@nestjs/common';
import { DeepgramClient, listen } from '@deepgram/sdk';
import { RawData, WebSocket } from 'ws';
import { InterviewAnswersService } from '../interview-answers.service';
import { hasMeaningfulSpeech } from './has-meaningful-speech';
import {
  KEEP_ALIVE_INTERVAL_MS,
  MAX_REPLY_LENGTH,
  REPLY_GAP_MS,
  REPLY_SETTLE_MS,
} from './live-audio.config';
import { LiveClientMessage, LiveServerMessage } from './live-audio.types';

type DeepgramSocket = Awaited<
  ReturnType<DeepgramClient['listen']['v1']['connect']>
>;

type DeepgramMessage =
  | listen.ListenV1Results
  | listen.ListenV1Metadata
  | listen.ListenV1UtteranceEnd
  | listen.ListenV1SpeechStarted;

interface LiveAudioSessionDeps {
  client: WebSocket;
  userId: string;
  sessionId: string;
  answers: InterviewAnswersService;
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
  private reply = '';
  private replyUpdatedAt = 0;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
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
    this.deps.client.close(1011, message);
  }

  close(): void {
    if (this.isClosed) return;
    this.isClosed = true;
    if (this.keepAlive) clearInterval(this.keepAlive);
    this.cancelSettle();
    this.deps.answers.release(this.deps.sessionId);
    this.pending.length = 0;
    this.closeDeepgram();
    if (this.deps.client.readyState === WebSocket.OPEN) {
      this.deps.client.close(1000);
    }
  }

  private closeDeepgram(): void {
    const socket = this.deepgram;
    this.deepgram = null;
    if (!socket) return;
    socket.sendCloseStream({ type: 'CloseStream' });
    socket.close();
  }

  private sendKeepAlive(): void {
    this.deepgram?.sendKeepAlive({ type: 'KeepAlive' });
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
    this.deepgram.sendMedia(chunk);
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
      this.cancelSettle();
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
    const reply = this.appendToReply(text);
    this.lastUtterance = { id, text: reply };
    if (force) this.answerReply(true);
    else if (hasMeaningfulSpeech(reply)) this.scheduleAnswer();
    return text;
  }

  private scheduleAnswer(): void {
    this.cancelSettle();
    this.settleTimer = setTimeout(
      () => this.answerReply(false),
      REPLY_SETTLE_MS,
    );
  }

  private cancelSettle(): void {
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = null;
  }

  private answerReply(force: boolean): void {
    this.cancelSettle();
    const { id, text } = this.lastUtterance;
    this.reply = '';
    void this.answer(id, text, force);
  }

  private restoreReply(text: string): void {
    this.reply = joinText(text, this.reply).slice(-MAX_REPLY_LENGTH);
    this.replyUpdatedAt = Date.now();
  }

  private appendToReply(text: string): string {
    const now = Date.now();
    const previous = now - this.replyUpdatedAt > REPLY_GAP_MS ? '' : this.reply;
    this.reply = joinText(previous, text).slice(-MAX_REPLY_LENGTH);
    this.replyUpdatedAt = now;
    return this.reply;
  }

  private answerNow(): void {
    if (this.finishUtterance(true)) return;
    if (!this.lastUtterance.text) return;
    void this.answer(this.lastUtterance.id, this.lastUtterance.text, true);
  }

  private async answer(
    utteranceId: number,
    question: string,
    force: boolean,
  ): Promise<void> {
    const { answers, userId, sessionId } = this.deps;
    try {
      const answerId = force
        ? await answers.ask(userId, sessionId, question)
        : await answers.askIfExpected(userId, sessionId, question);
      if (!answerId) {
        this.restoreReply(question);
        return;
      }
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
