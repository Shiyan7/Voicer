import { IDLE_HEIGHT, VOICE_HEIGHT } from '../config/voiceWaveConfig';
import { WaveFrame } from '../types/WaveFrame';
import { createSpring } from './createSpring';
import { follow } from './follow';

const QUIET_LOUDEST = 0.3;

const LOUDEST_MEMORY_SEC = 3;

const FADE_SEC = 0.3;

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

export const createWaveMotion = (paused: boolean) => {
  const swell = createSpring({ stiffness: 44, damping: 9 });
  let loudest = QUIET_LOUDEST;
  let presence = paused ? 0 : 1;

  const update = (dt: number, level: number, isPaused: boolean): WaveFrame => {
    const voice = isPaused ? 0 : level;
    loudest = Math.max(
      voice,
      follow(loudest, QUIET_LOUDEST, dt, LOUDEST_MEMORY_SEC),
    );
    const target = IDLE_HEIGHT + VOICE_HEIGHT * (voice / loudest);
    const size = Math.max(0, swell.step(dt, target));
    const tempo = isPaused || reducedMotion ? 0 : size / IDLE_HEIGHT;
    presence = follow(presence, isPaused ? 0 : 1, dt, FADE_SEC);
    return { size, presence, travel: dt * tempo };
  };

  return { update };
};
