import { SpeakerTrack } from './SpeakerTrack';

export interface PlayerControlsProps {
  isPlaying: boolean;
  isDisabled: boolean;
  isSpeakersOpen: boolean;
  hasTracks: boolean;
  playLabel: string;
  rateLabel: string;
  tracks: SpeakerTrack[];
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onCycleRate: () => void;
  onToggleSpeakers: () => void;
}
