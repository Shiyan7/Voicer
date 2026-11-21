export const MAX_DPR = 2;

export const PRESENCE_SEC = 0.28;

export const SETTLED_LEVEL = 0.001;

export const MAX_FRAME_SEC = 0.05;

export const NOISE_FLOOR_FALL_SEC = 0.15;

export const NOISE_FLOOR_RISE_SEC = 6;

export const PEAK_DECAY_SEC = 3;

export const VOICE_GATE = 0.14;

export const MIN_VOICE_RANGE = 0.3;

export const FAST_ATTACK_SEC = 0.02;

export const FAST_RELEASE_SEC = 0.09;

export const SLOW_SEC = 0.3;

export const ENERGY_ATTACK_SEC = 0.12;

export const ENERGY_RELEASE_SEC = 0.6;

export const ONSET_THRESHOLD = 0.08;

export const ONSET_RISE = 0.08;

export const ONSET_FALL = 0.04;

export const SAMPLE_STEP_PX = 4;

export const EDGE_WIDTH_PX = 1;

export const CLIP_KNEE = 0.7;

export const IDLE_AMPLITUDE = 0.16;

export const SUSTAIN_GAIN = 0.5;

export const ONSET_KICK = 2.6;

export const ONSET_KICK_FLOOR = 0.4;

export const MIN_SHAPE = 0.12;

export const MORPH_IDLE = 0.12;

export const MORPH_ENERGY_GAIN = 0.35;

export const MORPH_BURST = 0.35;

export const MORPH_BURST_SEC = 0.7;

export const DRIFT_IDLE = 0.4;

export const DRIFT_ENERGY_GAIN = 0.8;

export const FLOW_PERIOD_RATIO = 1.6;

export const FLOW_IDLE_PX = 14;

export const FLOW_ENERGY_PX = 60;

export const SHEEN_ALPHA = 0.16;

export const SHEEN_RADIUS_RATIO = 0.22;

export const SHEEN_SPEED = 0.35;

export const SHEEN_SWAY = 0.32;

export const WAVE_LAYERS = [
  {
    depth: 1,
    spacingPx: 560,
    driftPx: 18,
    morphSpeed: 0.7,
    stiffness: 38,
    damping: 8,
    lagSec: 0.12,
    alpha: 0.24,
    edgeAlpha: 0.55,
  },
  {
    depth: 0.72,
    spacingPx: 400,
    driftPx: -14,
    morphSpeed: 0.9,
    stiffness: 50,
    damping: 8.5,
    lagSec: 0,
    alpha: 0.5,
    edgeAlpha: 0.7,
  },
] as const;

export const FLOW_COLOR_TOKENS = [
  '--color-voice-blue',
  '--color-voice-violet',
  '--color-voice-pink',
  '--color-voice-violet',
] as const;
