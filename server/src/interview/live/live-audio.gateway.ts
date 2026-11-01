import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DeepgramClient } from '@deepgram/sdk';
import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { AuthService } from '../../auth/auth.service';
import { InterviewAnswersService } from '../interview-answers.service';
import { InterviewLanguage } from '../interview-language.enum';
import { InterviewSessionsService } from '../interview-sessions.service';
import { DEEPGRAM_LIVE_OPTIONS, LIVE_AUDIO_PATH } from './live-audio.config';
import { LiveAudioSession } from './live-audio.session';

interface LiveAudioIdentity {
  userId: string;
  sessionId: string;
  language: InterviewLanguage;
}

const rejectUpgrade = (socket: Duplex, status: string): void => {
  socket.write(`HTTP/1.1 ${status}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
};

@Injectable()
export class LiveAudioGateway
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(LiveAudioGateway.name);
  private readonly server = new WebSocketServer({ noServer: true });
  private readonly sessions = new Set<LiveAudioSession>();

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly authService: AuthService,
    private readonly interviewSessions: InterviewSessionsService,
    private readonly answers: InterviewAnswersService,
    private readonly deepgram: DeepgramClient,
  ) {}

  onApplicationBootstrap(): void {
    const httpServer: Server = this.adapterHost.httpAdapter.getHttpServer();
    httpServer.on('upgrade', this.handleUpgrade);
  }

  onApplicationShutdown(): void {
    this.sessions.forEach((session) => session.close());
    this.server.close();
  }

  private readonly handleUpgrade = (
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ): void => {
    const url = new URL(request.url ?? '', 'http://localhost');
    if (url.pathname !== LIVE_AUDIO_PATH) return;
    void this.accept(request, socket, head, url);
  };

  private async accept(
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer,
    url: URL,
  ): Promise<void> {
    const identity = await this.identify(url);
    if (!identity) {
      rejectUpgrade(socket, '401 Unauthorized');
      return;
    }
    this.server.handleUpgrade(request, socket, head, (client) =>
      this.open(client, identity),
    );
  }

  private async identify(url: URL): Promise<LiveAudioIdentity | null> {
    const token = url.searchParams.get('token');
    const sessionId = url.searchParams.get('sessionId');
    if (!token || !sessionId) return null;
    try {
      const user = await this.authService.authenticateAccessToken(token);
      const { language } = await this.interviewSessions.findOwned(
        user.id,
        sessionId,
      );
      return { userId: user.id, sessionId, language };
    } catch {
      return null;
    }
  }

  private open(client: WebSocket, identity: LiveAudioIdentity): void {
    const { language, ...deps } = identity;
    const session = new LiveAudioSession({
      client,
      ...deps,
      answers: this.answers,
    });
    this.sessions.add(session);
    client.on('close', () => this.sessions.delete(session));
    session
      .attach(() =>
        this.deepgram.listen.v1.connect({ ...DEEPGRAM_LIVE_OPTIONS, language }),
      )
      .catch((error: unknown) => {
        this.logger.error(
          `Deepgram live connection failed for ${identity.sessionId}`,
          error instanceof Error ? error.stack : String(error),
        );
        session.fail('Deepgram unavailable');
      });
  }
}
