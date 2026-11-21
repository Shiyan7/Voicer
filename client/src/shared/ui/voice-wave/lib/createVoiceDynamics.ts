import {
  ENERGY_ATTACK_SEC,
  ENERGY_RELEASE_SEC,
  MIN_VOICE_RANGE,
  NOISE_FLOOR_FALL_SEC,
  NOISE_FLOOR_RISE_SEC,
  PEAK_DECAY_SEC,
  VOICE_ATTACK_SEC,
  VOICE_GATE,
  VOICE_RELEASE_SEC,
} from '../config/voiceWaveConfig';
import { VoiceFrame } from '../types/VoiceFrame';
import { follow } from './follow';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const createVoiceDynamics = () => {
  let floor: number | undefined;
  let peak = 0;
  const frame: VoiceFrame = { voice: 0, energy: 0 };

  const update = (level: number, dt: number) => {
    floor = follow(
      floor ?? level,
      level,
      dt,
      NOISE_FLOOR_RISE_SEC,
      NOISE_FLOOR_FALL_SEC,
    );
    peak =
      level > peak
        ? level
        : follow(
            peak,
            floor + VOICE_GATE + MIN_VOICE_RANGE,
            dt,
            PEAK_DECAY_SEC,
          );
    const range = Math.max(MIN_VOICE_RANGE, peak - floor - VOICE_GATE);
    const voice = clamp01((level - floor - VOICE_GATE) / range);

    frame.voice = follow(
      frame.voice,
      voice,
      dt,
      VOICE_ATTACK_SEC,
      VOICE_RELEASE_SEC,
    );
    frame.energy = follow(
      frame.energy,
      voice,
      dt,
      ENERGY_ATTACK_SEC,
      ENERGY_RELEASE_SEC,
    );
    return frame;
  };

  return { update };
};
