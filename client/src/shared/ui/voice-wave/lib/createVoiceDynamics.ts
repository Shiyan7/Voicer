import {
  ENERGY_ATTACK_SEC,
  ENERGY_RELEASE_SEC,
  FAST_ATTACK_SEC,
  FAST_RELEASE_SEC,
  MIN_VOICE_RANGE,
  NOISE_FLOOR_FALL_SEC,
  NOISE_FLOOR_RISE_SEC,
  ONSET_FALL,
  ONSET_RISE,
  ONSET_THRESHOLD,
  PEAK_DECAY_SEC,
  SLOW_SEC,
  VOICE_GATE,
} from '../config/voiceWaveConfig';
import { VoiceFrame } from '../types/VoiceFrame';
import { follow } from './follow';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const createVoiceDynamics = () => {
  let floor: number | undefined;
  let peak = 0;
  let fast = 0;
  let slow = 0;
  let isRising = false;
  let onsetPeak = 0;
  let onsetTrough = 0;
  const frame: VoiceFrame = {
    voice: 0,
    onset: 0,
    energy: 0,
    isNewOnset: false,
  };

  const update = (level: number, dt: number) => {
    floor ??= level;
    floor = follow(
      floor,
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

    fast = follow(fast, voice, dt, FAST_ATTACK_SEC, FAST_RELEASE_SEC);
    slow = follow(slow, voice, dt, SLOW_SEC);
    const onset = Math.max(0, fast - slow);
    let isNewOnset = false;
    if (isRising) {
      onsetPeak = Math.max(onsetPeak, onset);
      if (onset < onsetPeak - ONSET_FALL) {
        isRising = false;
        onsetTrough = onset;
      }
    } else {
      onsetTrough = Math.min(onsetTrough, onset);
      if (onset > ONSET_THRESHOLD && onset > onsetTrough + ONSET_RISE) {
        isRising = true;
        isNewOnset = true;
        onsetPeak = onset;
      }
    }

    frame.voice = fast;
    frame.onset = onset;
    frame.energy = follow(
      frame.energy,
      voice,
      dt,
      ENERGY_ATTACK_SEC,
      ENERGY_RELEASE_SEC,
    );
    frame.isNewOnset = isNewOnset;
    return frame;
  };

  return { update };
};
