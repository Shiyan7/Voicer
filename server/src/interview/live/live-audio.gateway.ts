import { IncomingMessage, Server } from 'http';
import { Duplex } from 'stream';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DeepgramClient } from '@deepgram/sdk';
import { WebSocket, WebSocketServer } from 'ws';
import { describeError } from '../../common/describe-error';
import { AuthService } from '../../auth/auth.service';
import { InterviewAnswersService } from '../interview-answers.service';
import { InterviewLanguage } from '../interview-language.enum';
import { InterviewMode } from '../interview-mode.enum';
import { InterviewSessionsService } from '../interview-sessions.service';
import { MockInterviewerService } from '../mock-interviewer.service';
import {
  DEEPGRAM_LIVE_OPTIONS,
  LIVE_AUDIO_PATH,
  LIVE_AUDIO_PROTOCOL,
} from './live-audio.config';
import { LiveAudioSession } from './live-audio.session';
import { MockInterviewSession } from './mock-interview.session';

interface LiveAudioIdentity {
  userId: string;
  sessionId: string;
  language: InterviewLanguage;
  mode: InterviewMode;
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
  private readonly server = new WebSocketServer({
    noServer: true,
    handleProtocols: () => LIVE_AUDIO_PROTOCOL,
  });
  private readonly sessions = new Set<
    LiveAudioSession | MockInterviewSession
  >();

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly authService: AuthService,
    private readonly interviewSessions: InterviewSessionsService,
    private readonly answers: InterviewAnswersService,
    private readonly interviewer: MockInterviewerService,
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
    const identity = await this.identify(url, this.readToken(request));
    if (!identity) {
      rejectUpgrade(socket, '401 Unauthorized');
      return;
    }
    this.server.handleUpgrade(request, socket, head, (client) =>
      this.open(client, identity),
    );
  }

  private readToken(request: IncomingMessage): string | null {
    const protocols = request.headers['sec-websocket-protocol'] ?? '';
    const [protocol, token] = protocols.split(',').map((part) => part.trim());
    return protocol === LIVE_AUDIO_PROTOCOL && token ? token : null;
  }

  private async identify(
    url: URL,
    token: string | null,
  ): Promise<LiveAudioIdentity | null> {
    const sessionId = url.searchParams.get('sessionId');
    if (!token || !sessionId) return null;
    try {
      const user = await this.authService.authenticateAccessToken(token);
      const { language, mode } = await this.interviewSessions.findOwned(
        user.id,
        sessionId,
      );
      return { userId: user.id, sessionId, language, mode };
    } catch {
      return null;
    }
  }

  private open(client: WebSocket, identity: LiveAudioIdentity): void {
    const { language, mode, ...deps } = identity;
    const session =
      mode === InterviewMode.MOCK
        ? new MockInterviewSession({
            client,
            ...deps,
            interviewer: this.interviewer,
          })
        : new LiveAudioSession({ client, ...deps, answers: this.answers });
    this.sessions.add(session);
    client.on('close', () => this.sessions.delete(session));
    this.deepgram.listen.v1
      .connect({ ...DEEPGRAM_LIVE_OPTIONS, language })
      .then((socket) => session.attach(socket))
      .catch((error: unknown) => {
        this.logger.error(
          `Deepgram live connection failed for ${identity.sessionId}`,
          describeError(error),
        );
        session.fail('Deepgram unavailable');
      });
  }
}
