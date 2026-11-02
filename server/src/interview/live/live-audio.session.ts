import { Logger } from '@nestjs/common';
import { DeepgramClient, listen } from '@deepgram/sdk';
import { RawData, WebSocket } from 'ws';
import { describeError } from '../../common/describe-error';
import { InterviewAnswersService } from '../interview-answers.service';
import { hasMeaningfulSpeech } from './has-meaningful-speech';
import { joinText } from './join-text';
import { KEEP_ALIVE_INTERVAL_MS, REPLY_SETTLE_MS } from './live-audio.config';
import { LiveClientMessage, LiveServerMessage } from './live-audio.types';
import { ReplyBuffer } from './reply-buffer';

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

export class LiveAudioSession {
  private readonly logger = new Logger(LiveAudioSession.name);
  private readonly pending: Buffer[] = [];
  private deepgram: DeepgramSocket | null = null;
  private keepAlive: ReturnType<typeof setInterval> | null = null;
  private utteranceId = 1;
  private committed = '';
  private interim = '';
  private lastReply = { utteranceId: 0, text: '' };
  private readonly reply = new ReplyBuffer();
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private isClosed = false;

  constructor(private readonly deps: LiveAudioSessionDeps) {
    deps.client.on('message', (data, isBinary) =>
      this.onClientMessage(data, isBinary),
    );
    deps.client.on('close', () => this.close());
    deps.client.on('error', () => this.close());
  }

  async attach(socket: DeepgramSocket): Promise<void> {
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
      });
    }

    if (speechFinal) this.finishUtterance();
  }

  private finishUtterance(): void {
    if (!this.closeUtterance()) return;
    if (hasMeaningfulSpeech(this.lastReply.text)) this.scheduleAnswer();
  }

  private closeUtterance(): boolean {
    const text = joinText(this.committed, this.interim);
    if (!text) return false;
    const utteranceId = this.utteranceId;
    this.send({ type: 'utteranceEnd', utteranceId });
    this.committed = '';
    this.interim = '';
    this.utteranceId += 1;
    this.lastReply = { utteranceId, text: this.reply.append(text) };
    return true;
  }

  private scheduleAnswer(): void {
    this.cancelSettle();
    this.settleTimer = setTimeout(
      () => this.answerIfExpected(),
      REPLY_SETTLE_MS,
    );
  }

  private cancelSettle(): void {
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = null;
  }

  private takeReply(): void {
    this.cancelSettle();
    this.reply.clear();
  }

  private answerIfExpected(): void {
    this.takeReply();
    const { answers, userId, sessionId } = this.deps;
    const { utteranceId, text } = this.lastReply;
    void this.publishAnswer(utteranceId, async () => {
      const answerId = await answers.askIfExpected(userId, sessionId, text);
      if (!answerId) this.reply.restore(text);
      return answerId;
    });
  }

  private answerNow(): void {
    if (this.closeUtterance()) this.takeReply();
    const { utteranceId, text } = this.lastReply;
    if (!text) return;
    const { answers, userId, sessionId } = this.deps;
    void this.publishAnswer(utteranceId, () =>
      answers.ask(userId, sessionId, text),
    );
  }

  private async publishAnswer(
    utteranceId: number,
    ask: () => Promise<string | null>,
  ): Promise<void> {
    try {
      const answerId = await ask();
      if (answerId) this.send({ type: 'answerStarted', utteranceId, answerId });
    } catch (error) {
      this.logger.warn(`Answer failed: ${describeError(error)}`);
    }
  }

  private send(message: LiveServerMessage): void {
    if (this.deps.client.readyState !== WebSocket.OPEN) return;
    this.deps.client.send(JSON.stringify(message));
  }
}
