import {
  AUDIO_PRESETS,
  AUDIO_SETTINGS_STORAGE_KEY,
} from '../config/playerConfig';
import { AudioPreset } from '../types/AudioPreset';

interface StoredAudioSettings {
  preset: AudioPreset;
  isLeveling: boolean;
}

export const readAudioSettings = (): StoredAudioSettings => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY) ?? '{}',
    );

    return {
      preset: AUDIO_PRESETS.includes(stored.preset)
        ? stored.preset
        : AUDIO_PRESETS[0],
      isLeveling: stored.isLeveling === true,
    };
  } catch {
    return { preset: AUDIO_PRESETS[0], isLeveling: false };
  }
};

export const writeAudioSettings = (settings: StoredAudioSettings) => {
  try {
    localStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    return;
  }
};
