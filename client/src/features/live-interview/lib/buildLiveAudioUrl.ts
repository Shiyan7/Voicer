import { LIVE_AUDIO_PATH } from '../config/liveInterviewConfig';

export const buildLiveAudioUrl = (apiUrl: string, sessionId: string) => {
  const url = new URL(apiUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = LIVE_AUDIO_PATH;
  url.search = new URLSearchParams({ sessionId }).toString();
  return url.toString();
};
