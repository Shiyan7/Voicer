import { Logger } from '@nestjs/common';
import { DeepgramClient, listen } from '@deepgram/sdk';
import { KEEP_ALIVE_INTERVAL_MS } from './live-audio.config';

export type DeepgramSocket = Awaited<
  ReturnType<DeepgramClient['listen']['v1']['connect']>
>;

export type DeepgramMessage =
  | listen.ListenV1Results
  | listen.ListenV1Metadata
  | listen.ListenV1UtteranceEnd
  | listen.ListenV1SpeechStarted;

interface DeepgramLinkHandlers {
  onMessage: (message: DeepgramMessage) => void;
  onClose: () => void;
}

export class DeepgramLink {
  private readonly logger = new Logger(DeepgramLink.name);
  private readonly pending: Buffer[] = [];
  private socket: DeepgramSocket | null = null;
  private keepAlive: ReturnType<typeof setInterval> | null = null;
  private isClosed = false;

  async attach(
    socket: DeepgramSocket,
    { onMessage, onClose }: DeepgramLinkHandlers,
  ): Promise<void> {
    socket.on('message', onMessage);
    socket.on('error', (error) => this.logger.warn(error.message));
    socket.on('close', onClose);
    socket.connect();
    await socket.waitForOpen();
    if (this.isClosed) {
      socket.close();
      return;
    }
    this.socket = socket;
    this.pending.splice(0).forEach((chunk) => socket.sendMedia(chunk));
    this.keepAlive = setInterval(
      () => socket.sendKeepAlive({ type: 'KeepAlive' }),
      KEEP_ALIVE_INTERVAL_MS,
    );
  }

  send(chunk: Buffer): void {
    if (!this.socket) {
      this.pending.push(chunk);
      return;
    }
    this.socket.sendMedia(chunk);
  }

  close(): void {
    this.isClosed = true;
    if (this.keepAlive) clearInterval(this.keepAlive);
    this.pending.length = 0;
    const socket = this.socket;
    this.socket = null;
    if (!socket) return;
    socket.sendCloseStream({ type: 'CloseStream' });
    socket.close();
  }
}
