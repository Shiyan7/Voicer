export const BASE_RADIUS_RATIO = 0.23;

export const BLOB_POINTS = 24;

export const MAX_DPR = 2;

export const ATTACK_SEC = 0.06;

export const RELEASE_SEC = 0.28;

export const SETTLED_LEVEL = 0.001;

export const HIDDEN_SCALE = 0.8;

export const STROKE_WIDTH = 1;

export const BLOB_LAYERS = [
  {
    scale: 1.08,
    growth: 0.32,
    wobble: 0.03,
    speed: 1,
    alpha: 0.4,
    stroke: 0.5,
  },
  {
    scale: 1.16,
    growth: 0.6,
    wobble: 0.05,
    speed: -0.7,
    alpha: 0.2,
    stroke: 0.35,
  },
] as const;
