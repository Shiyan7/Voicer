import { SpeakerTone } from './SpeakerTone';

export interface SpeakerRange {
  startMs: number;
  left: string;
  width: string;
}

export interface SpeakerTrack {
  speakerIndex: number;
  label: string;
  initial: string;
  tone: SpeakerTone;
  shareLabel: string;
  ranges: SpeakerRange[];
}
