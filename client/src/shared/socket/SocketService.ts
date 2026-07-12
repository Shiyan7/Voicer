import { io, Socket } from 'socket.io-client';
import { singleton } from '@/shared/di';

import { MeetingStatus } from '@/entities/meeting';
import { tokenStore } from '@/shared/api/tokenStore';
import { isTauri } from '@/shared/isTauri';

export type MeetingUpdatedEvent = {
  id: string;
  status: MeetingStatus;
};

type MeetingUpdatedHandler = (event: MeetingUpdatedEvent) => void;

@singleton()
export class SocketService {
  private origin = new URL(import.meta.env.VITE_API_URL, window.location.origin)
    .origin;

  private socket: Socket | null = null;

  private meetingUpdatedHandlers = new Set<MeetingUpdatedHandler>();

  get isConnected() {
    return this.socket?.connected ?? false;
  }

  connect = () => {
    if (this.socket?.connected) return;

    this.socket?.disconnect();
    this.socket = null;

    const token = isTauri() ? tokenStore.accessToken : null;

    this.socket = io(this.origin, {
      withCredentials: true,
      auth: token ? { token } : undefined,
    });

    this.socket.on('meeting.updated', (event: MeetingUpdatedEvent) => {
      this.meetingUpdatedHandlers.forEach((handler) => handler(event));
    });
  };

  disconnect = () => {
    this.socket?.disconnect();
    this.socket = null;
  };

  onMeetingUpdated = (handler: MeetingUpdatedHandler) => {
    this.meetingUpdatedHandlers.add(handler);

    return () => {
      this.meetingUpdatedHandlers.delete(handler);
    };
  };
}
