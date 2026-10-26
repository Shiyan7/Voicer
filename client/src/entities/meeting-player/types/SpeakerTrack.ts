import type { SpeakerTone } from '@/shared/ui/speaker-avatar';

export interface SpeakerRange {
  startMs: number;
  left: string;
  width: string;
}

export interface SpeakerTrack {
  speakerIndex: number;
  label: string;
  tone: SpeakerTone;
  shareLabel: string;
  ranges: SpeakerRange[];
}
