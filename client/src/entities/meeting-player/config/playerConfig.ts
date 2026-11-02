import { AudioPreset } from '../types/AudioPreset';

export const PLAYBACK_RATES = [1, 1.25, 1.5, 2];

export const SKIP_SECONDS = 15;

export const VOLUME_DEFAULT = 100;

export const VOLUME_MAX = 1500;

export const VOLUME_STEP = 10;

export const VOLUME_SNAP_RANGE = 30;

export const AUDIO_PRESETS: AudioPreset[] = ['normal', 'hum', 'voice'];

export const AUDIO_PRESET_FILTERS: Record<
  AudioPreset,
  {
    highpassHz: number;
    humNotchDb: number;
    presenceDb: number;
    trebleDb: number;
  }
> = {
  normal: {
    highpassHz: 10,
    humNotchDb: 0,
    presenceDb: 0,
    trebleDb: 0,
  },
  hum: {
    highpassHz: 220,
    humNotchDb: -24,
    presenceDb: 0,
    trebleDb: 0,
  },
  voice: {
    highpassHz: 220,
    humNotchDb: -24,
    presenceDb: 4,
    trebleDb: -18,
  },
};

export const HIGHPASS_STAGES_Q_DB = [-5.85, -4.44, -0.92, 8.16];

export const HUM_NOTCH_HZ = [240, 360];

export const HUM_NOTCH_Q = 8;

export const PRESENCE_HZ = 1200;

export const PRESENCE_Q = 0.7;

export const TREBLE_HZ = 4000;

export const LEVELING_COMPRESSOR = {
  threshold: -28,
  knee: 24,
  ratio: 4,
  attack: 0.005,
  release: 0.2,
};

export const AUDIO_SETTINGS_STORAGE_KEY = 'voicer.player.audio-settings';
