import { createSignal, onCleanup } from 'solid-js';

import { AUDIO_PRESETS, VOLUME_DEFAULT } from '../config/playerConfig';
import {
  readAudioSettings,
  writeAudioSettings,
} from '../lib/audioSettingsStorage';
import { createAudioChain } from '../lib/createAudioChain';
import { AudioPreset } from '../types/AudioPreset';

export const useAudioProcessing = (
  getElement: () => HTMLAudioElement | undefined,
) => {
  let chain: ReturnType<typeof createAudioChain> | undefined;

  const stored = readAudioSettings();

  const [volume, setVolumeValue] = createSignal(VOLUME_DEFAULT);
  const [preset, setPresetValue] = createSignal(stored.preset);
  const [isLeveling, setIsLeveling] = createSignal(stored.isLeveling);

  const isChanged = () =>
    volume() !== VOLUME_DEFAULT ||
    preset() !== AUDIO_PRESETS[0] ||
    isLeveling();

  const ensureChain = () => {
    const element = getElement();
    if (chain || !element) return chain;

    chain = createAudioChain(element);
    chain.setVolume(volume());
    chain.setPreset(preset());
    chain.setLeveling(isLeveling());

    return chain;
  };

  const persist = () =>
    writeAudioSettings({ preset: preset(), isLeveling: isLeveling() });

  const applyChanges = () => {
    const active = ensureChain();
    active?.setVolume(volume());
    active?.setPreset(preset());
    active?.setLeveling(isLeveling());
    void active?.resume();
  };

  const setVolume = (percent: number) => {
    setVolumeValue(percent);
    applyChanges();
  };

  const setPreset = (next: AudioPreset) => {
    setPresetValue(next);
    persist();
    applyChanges();
  };

  const toggleLeveling = () => {
    setIsLeveling((enabled) => !enabled);
    persist();
    applyChanges();
  };

  const resetAudio = () => {
    setVolumeValue(VOLUME_DEFAULT);
    setPresetValue(AUDIO_PRESETS[0]);
    setIsLeveling(false);
    persist();
    applyChanges();
  };

  const resumeAudio = () => {
    if (isChanged()) ensureChain();
    void chain?.resume();
  };

  onCleanup(() => void chain?.close());

  return {
    volume,
    audioPreset: preset,
    isLeveling,
    isAudioChanged: isChanged,
    setVolume,
    setAudioPreset: setPreset,
    toggleLeveling,
    resetAudio,
    resumeAudio,
  };
};
