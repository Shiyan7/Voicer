import { VOICE_LEVEL_FLOOR_DB } from '../config/callRecorderConfig';

export const toVoiceLevel = (rms: number) => {
  if (rms <= 0) return 0;
  const db = 20 * Math.log10(rms);
  return Math.min(1, Math.max(0, 1 - db / VOICE_LEVEL_FLOOR_DB));
};
