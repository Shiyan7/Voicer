import { authRoot } from '@/shared/roots/authRoot';

import { LIVE_AUDIO_PROTOCOL } from '../config/liveInterviewConfig';
import { buildLiveAudioUrl } from '../lib/buildLiveAudioUrl';
import { LiveServerMessage } from '../types/LiveServerMessage';

interface LiveAudioSocketHandlers {
  onMessage: (message: LiveServerMessage) => void;
  onClose: () => void;
}

export const openLiveAudioSocket = (
  sessionId: string,
  { onMessage, onClose }: LiveAudioSocketHandlers,
) => {
  const socket = new WebSocket(
    buildLiveAudioUrl(import.meta.env.VITE_GRAPHQL_API_URL, sessionId),
    [LIVE_AUDIO_PROTOCOL, authRoot.accessToken ?? ''],
  );
  socket.binaryType = 'arraybuffer';
  socket.onmessage = (event: MessageEvent<string>) =>
    onMessage(JSON.parse(event.data) as LiveServerMessage);
  socket.onclose = onClose;

  const sendAudio = (pcm: Int16Array) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(pcm.slice());
  };

  const requestAnswer = () => {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'answerNow' }));
  };

  const close = () => socket.close();

  return { sendAudio, requestAnswer, close };
};
