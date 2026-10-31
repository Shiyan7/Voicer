import type { OrbSize, OrbState } from 'thinking-orbs/engine';

export interface ThinkingOrbProps {
  state: OrbState;
  size: OrbSize;
  class?: string;
}
