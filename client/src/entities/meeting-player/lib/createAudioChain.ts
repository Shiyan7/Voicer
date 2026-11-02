import {
  AUDIO_PRESET_FILTERS,
  HIGHPASS_STAGES_Q_DB,
  HUM_NOTCH_HZ,
  HUM_NOTCH_Q,
  LEVELING_COMPRESSOR,
  PRESENCE_HZ,
  PRESENCE_Q,
  TREBLE_HZ,
} from '../config/playerConfig';
import { AudioPreset } from '../types/AudioPreset';

export const createAudioChain = (element: HTMLAudioElement) => {
  const context = new AudioContext();
  const source = context.createMediaElementSource(element);
  const highpasses = HIGHPASS_STAGES_Q_DB.map(
    (Q) => new BiquadFilterNode(context, { type: 'highpass', Q }),
  );
  const humNotches = HUM_NOTCH_HZ.map(
    (frequency) =>
      new BiquadFilterNode(context, {
        type: 'peaking',
        frequency,
        Q: HUM_NOTCH_Q,
      }),
  );
  const presence = new BiquadFilterNode(context, {
    type: 'peaking',
    frequency: PRESENCE_HZ,
    Q: PRESENCE_Q,
  });
  const treble = new BiquadFilterNode(context, {
    type: 'highshelf',
    frequency: TREBLE_HZ,
  });
  const compressor = new DynamicsCompressorNode(context, LEVELING_COMPRESSOR);
  const gain = context.createGain();

  [...highpasses, ...humNotches, presence, treble].reduce<AudioNode>(
    (previous, next) => previous.connect(next),
    source,
  );
  treble.connect(gain);
  compressor.connect(gain);
  gain.connect(context.destination);

  const setVolume = (percent: number) => {
    gain.gain.value = percent / 100;
  };

  const setPreset = (preset: AudioPreset) => {
    const filters = AUDIO_PRESET_FILTERS[preset];
    highpasses.forEach((filter) => {
      filter.frequency.value = filters.highpassHz;
    });
    humNotches.forEach((filter) => {
      filter.gain.value = filters.humNotchDb;
    });
    presence.gain.value = filters.presenceDb;
    treble.gain.value = filters.trebleDb;
  };

  const setLeveling = (isEnabled: boolean) => {
    treble.disconnect();
    treble.connect(isEnabled ? compressor : gain);
  };

  const resume = () => context.resume();

  const close = () => context.close();

  return { setVolume, setPreset, setLeveling, resume, close };
};
