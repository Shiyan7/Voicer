export const WAVE_COLORS = ['#2f8bff', '#8b5cff', '#ff3fa4', '#8b5cff'];

export const IDLE_HEIGHT = 0.16;

export const VOICE_HEIGHT = 0.7;

export const FLOW_SPEED_PX = 14;

export const WAVE_LAYERS = [
  {
    depth: 1,
    spacingPx: 560,
    morphSpeed: 0.12,
    driftPx: 5,
    alpha: 0.24,
    edgeAlpha: 0.55,
  },
  {
    depth: 0.72,
    spacingPx: 400,
    morphSpeed: 0.15,
    driftPx: -4,
    alpha: 0.5,
    edgeAlpha: 0.7,
  },
] as const;
