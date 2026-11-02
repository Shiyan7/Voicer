import { authRoot } from '@/shared/roots/authRoot';

import {
  MOCK_AUDIO_PATH,
  MOCK_AUDIO_PROTOCOL,
} from '../config/mockInterviewConfig';
import { MockServerMessage } from '../types/MockServerMessage';

interface MockSocketHandlers {
  onMessage: (message: MockServerMessage) => void;
  onClose: () => void;
}

const buildUrl = (sessionId: string) => {
  const url = new URL(import.meta.env.VITE_GRAPHQL_API_URL);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = MOCK_AUDIO_PATH;
  url.search = new URLSearchParams({ sessionId }).toString();
  return url.toString();
};

export const openMockInterviewSocket = (
  sessionId: string,
  { onMessage, onClose }: MockSocketHandlers,
) => {
  const socket = new WebSocket(buildUrl(sessionId), [
    MOCK_AUDIO_PROTOCOL,
    authRoot.accessToken ?? '',
  ]);
  socket.binaryType = 'arraybuffer';
  socket.onmessage = (event: MessageEvent<string>) =>
    onMessage(JSON.parse(event.data) as MockServerMessage);
  socket.onclose = onClose;

  const sendSpeechEnded = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'speechEnded' }));
    }
  };

  const sendAudio = (pcm: Int16Array) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(pcm.slice());
  };

  const close = () => {
    socket.onclose = null;
    socket.close();
  };

  return { sendSpeechEnded, sendAudio, close };
};
