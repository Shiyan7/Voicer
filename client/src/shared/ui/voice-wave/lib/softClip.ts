import { CLIP_KNEE } from '../config/voiceWaveConfig';

export const softClip = (value: number, max: number) => {
  const knee = max * CLIP_KNEE;
  if (value <= knee) return Math.max(0, value);
  const headroom = max - knee;
  return knee + headroom * Math.tanh((value - knee) / headroom);
};
