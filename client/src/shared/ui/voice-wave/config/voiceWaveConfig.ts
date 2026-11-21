export const MAX_DPR = 2;

export const MAX_FRAME_SEC = 0.05;

export const PRESENCE_SEC = 0.28;

export const SETTLED_LEVEL = 0.001;

export const NOISE_FLOOR_RISE_SEC = 6;

export const NOISE_FLOOR_FALL_SEC = 0.15;

export const PEAK_DECAY_SEC = 3;

export const VOICE_GATE = 0.14;

export const MIN_VOICE_RANGE = 0.3;

export const VOICE_ATTACK_SEC = 0.02;

export const VOICE_RELEASE_SEC = 0.09;

export const ENERGY_ATTACK_SEC = 0.12;

export const ENERGY_RELEASE_SEC = 0.6;

export const IDLE_AMPLITUDE = 0.16;

export const VOICE_GAIN = 0.62;

export const TEMPO_GAIN = 4;

export const FLOW_PX = 14;

export const FLOW_PERIOD_RATIO = 1.6;

export const MIN_SHAPE = 0.12;

export const SAMPLE_STEP_PX = 4;

export const EDGE_WIDTH_PX = 1;

export const WAVE_LAYERS = [
  {
    depth: 1,
    spacingPx: 560,
    morphSpeed: 0.12,
    driftPx: 5,
    stiffness: 38,
    damping: 8,
    alpha: 0.24,
    edgeAlpha: 0.55,
  },
  {
    depth: 0.72,
    spacingPx: 400,
    morphSpeed: 0.15,
    driftPx: -4,
    stiffness: 50,
    damping: 8.5,
    alpha: 0.5,
    edgeAlpha: 0.7,
  },
] as const;

export const FLOW_COLORS = ['#2f8bff', '#8b5cff', '#ff3fa4', '#8b5cff'];
