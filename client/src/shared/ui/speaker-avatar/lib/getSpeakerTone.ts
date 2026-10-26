import { SPEAKER_TONES } from '../config/speakerTones';
import { SpeakerTone } from '../types';

export const getSpeakerTone = (speakerIndex: number): SpeakerTone =>
  SPEAKER_TONES[speakerIndex % SPEAKER_TONES.length];

export const getSpeakerLabel = (speakerIndex: number) =>
  `Speaker ${speakerIndex + 1}`;
