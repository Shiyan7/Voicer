import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtDto } from '../auth/dto/jwt.dto';
import { MEETING_UPDATED_EVENT, MeetingUpdatedEvent } from './meeting.events';

const LOCAL_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'tauri://localhost',
  'http://tauri.localhost',
  'https://tauri.localhost',
];

// Decorators are evaluated before ConfigModule loads .env, so the origin
// check is a callback that reads process.env at connection time.
@WebSocketGateway({
  cors: {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const whitelist = [...LOCAL_ORIGINS, process.env.CLIENT_URL].filter(
        Boolean,
      );
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    try {
      const token = this.extractToken(client);
      if (!token) {
        throw new Error('No token in handshake');
      }

      const payload = this.jwtService.verify<JwtDto>(token);
      void client.join(`user:${payload.userId}`);
    } catch {
      this.logger.debug(`Rejected socket connection ${client.id}`);
      client.disconnect(true);
    }
  }

  emitMeetingUpdated(
    userId: string,
    payload: { id: string; status: string },
  ): void {
    this.server.to(`user:${userId}`).emit('meeting.updated', payload);
  }

  @OnEvent(MEETING_UPDATED_EVENT)
  onMeetingUpdated(event: MeetingUpdatedEvent): void {
    this.emitMeetingUpdated(event.userId, {
      id: event.id,
      status: event.status,
    });
  }

  private extractToken(client: Socket): string | null {
    const authToken: unknown = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const cookieHeader = client.handshake.headers.cookie;
    if (!cookieHeader) {
      return null;
    }

    for (const part of cookieHeader.split(';')) {
      const [name, ...rest] = part.trim().split('=');
      if (name === 'accessToken') {
        return decodeURIComponent(rest.join('='));
      }
    }

    return null;
  }
}
