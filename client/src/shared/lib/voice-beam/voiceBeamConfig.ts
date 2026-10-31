export type VoiceBeamTheme = 'dark' | 'light';

export interface VoiceLobe {
  x: number;
  w: number;
  h: number;
  band: number;
}

export const VOICE_LOBES: VoiceLobe[] = [
  { x: 0, w: 74, h: 46, band: 0 },
  { x: -36, w: 54, h: 40, band: 1 },
  { x: 36, w: 54, h: 40, band: 1 },
  { x: -72, w: 48, h: 32, band: 2 },
  { x: 72, w: 48, h: 32, band: 2 },
  { x: -108, w: 42, h: 26, band: 1 },
  { x: 108, w: 42, h: 26, band: 1 },
];

export const LOBE_SPAN = 36 * VOICE_LOBES.length;

const PALETTES: Record<VoiceBeamTheme, string[]> = {
  dark: [
    'rgb(255, 70, 120)',
    'rgb(60, 190, 255)',
    'rgb(175, 70, 255)',
    'rgb(60, 220, 130)',
    'rgb(255, 150, 40)',
    'rgb(90, 100, 255)',
    'rgb(40, 200, 190)',
  ],
  light: [
    'rgb(255, 201, 21)',
    'rgb(126, 196, 255)',
    'rgb(180, 40, 230)',
    'rgb(235, 100, 160)',
    'rgb(255, 176, 122)',
    'rgb(154, 160, 255)',
    'rgb(127, 217, 238)',
  ],
};

const BAND_COLORS: Record<VoiceBeamTheme, VoiceBandColors> = {
  dark: {
    core: '255, 255, 255',
    above: '255, 70, 80',
    mid: '90, 255, 150',
    below: '80, 140, 255',
  },
  light: {
    core: '197, 139, 255',
    above: '255, 122, 182',
    mid: '126, 196, 255',
    below: '45, 255, 171',
  },
};

const PRESETS = {
  dark: {
    strokeOpacity: 1.16,
    innerOpacity: 0.47,
    bloomOpacity: 0.89,
    innerShadow: 'rgba(255, 255, 255, 0.1)',
    saturation: 1.2,
    brightness: 1.15,
    hueBase: 0,
    hueRange: 24,
    hueDuration: 12,
    strength: 1,
    bandStrength: 1.55,
    coreLight: 0.5,
  },
  light: {
    strokeOpacity: 1.1,
    innerOpacity: 0.9,
    bloomOpacity: 0.6,
    innerShadow: 'rgba(0, 0, 0, 0.08)',
    saturation: 1.15,
    brightness: 1,
    hueBase: 5,
    hueRange: 40,
    hueDuration: 8.5,
    strength: 1,
    bandStrength: 2,
    coreLight: 0,
  },
} as const;

const SCALE = 0.45;

export interface VoiceBandColors {
  core: string;
  above: string;
  mid: string;
  below: string;
}

export interface VoiceBeamCssConfig {
  id: string;
  borderRadius: number;
  borderWidth: number;
  strokeOpacity: number;
  innerOpacity: number;
  bloomOpacity: number;
  innerShadow: string;
  colors: string[];
  brightness: number;
  saturation: number;
  theme: VoiceBeamTheme;
  hueBase: number;
  glowSize: number;
  glowWidth: number;
  glowHeight: number;
  strokeScale: number;
  innerScale: number;
  innerHeight: number;
  bloomScale: number;
  bloomHeight: number;
  coreSize: number;
  coreLight: number;
  coreLightWidth: number;
  coreLightHeight: number;
  rangeWidth: number;
  rangeHeight: number;
  softness: number;
  distortion: boolean;
  scale: number;
}

export interface VoiceBeamDriverConfig {
  id: string;
  sensitivity: number;
  threshold: number;
  restLevel: number;
  attack: number;
  release: number;
  idle: number;
  breatheDuration: number;
  reach: number;
  spread: number;
  bands: boolean;
  flow: number;
  lobeSpacing: number;
  bend: number;
  bandStrength: number;
  bandWidth: number;
  bandPosition: number;
  bandCurve: number;
  bandSpread: number;
  bandSkew: number;
  bandOffset: number;
  bandTail: number;
  bandTailPosition: number;
  bandTailCurve: number;
  bandTailOverflow: number;
  bandAberration: number;
  rangeWidth: number;
  rangeHeight: number;
  theme: VoiceBeamTheme;
  bandColors: VoiceBandColors;
  distortion: number;
  distortionDetail: number;
  coreLight: number;
  scale: number;
  radius: number;
  hueRange: number;
  hueDuration: number;
  staticColors: boolean;
  reducedMotion: boolean;
  paused: boolean;
}

export interface VoiceBeamConfig {
  css: VoiceBeamCssConfig;
  driver: VoiceBeamDriverConfig;
  strength: number;
}

interface ResolveOptions {
  id: string;
  theme: VoiceBeamTheme;
  radius: number;
  paused: boolean;
  reducedMotion: boolean;
}

export const resolveVoiceBeamConfig = (
  options: ResolveOptions,
): VoiceBeamConfig => {
  const preset = PRESETS[options.theme];
  const rangeWidth = 0.8 * SCALE;
  const rangeHeight = 0.7 * SCALE;

  return {
    strength: preset.strength,
    css: {
      id: options.id,
      borderRadius: options.radius,
      borderWidth: 1,
      strokeOpacity: preset.strokeOpacity * 1.2,
      innerOpacity: preset.innerOpacity * 0.85,
      bloomOpacity: preset.bloomOpacity,
      innerShadow: preset.innerShadow,
      colors: PALETTES[options.theme],
      brightness: preset.brightness,
      saturation: preset.saturation,
      theme: options.theme,
      hueBase: preset.hueBase,
      glowSize: 0.95 * SCALE,
      glowWidth: 0.85 * SCALE,
      glowHeight: 1.25 * SCALE,
      strokeScale: 1.25,
      innerScale: 0.95,
      innerHeight: 1,
      bloomScale: 1.05,
      bloomHeight: 2.25,
      coreSize: 0.25 * SCALE,
      coreLight: preset.coreLight,
      coreLightWidth: 1,
      coreLightHeight: 1,
      rangeWidth,
      rangeHeight,
      softness: 0.88,
      distortion: true,
      scale: SCALE,
    },
    driver: {
      id: options.id,
      sensitivity: 3.1,
      threshold: 0.015,
      restLevel: 0.5,
      attack: 0.06,
      release: 0.3,
      idle: 0.18,
      breatheDuration: 5.2,
      reach: 2.6,
      spread: 1.6,
      bands: true,
      flow: 0,
      lobeSpacing: 0.45 * SCALE,
      bend: 23 * SCALE,
      bandStrength: preset.bandStrength,
      bandWidth: 1.85 * SCALE,
      bandPosition: 0.35,
      bandCurve: 1.95,
      bandSpread: 0.38,
      bandSkew: 0.12,
      bandOffset: -16 * SCALE,
      bandTail: 0,
      bandTailPosition: 0.67,
      bandTailCurve: 2.4,
      bandTailOverflow: 15 * SCALE,
      bandAberration: 0.89,
      rangeWidth,
      rangeHeight,
      theme: options.theme,
      bandColors: BAND_COLORS[options.theme],
      distortion: 0.45,
      distortionDetail: 3 / SCALE,
      coreLight: preset.coreLight,
      scale: SCALE,
      radius: options.radius,
      hueRange: preset.hueRange,
      hueDuration: preset.hueDuration,
      staticColors: false,
      reducedMotion: options.reducedMotion,
      paused: options.paused,
    },
  };
};
