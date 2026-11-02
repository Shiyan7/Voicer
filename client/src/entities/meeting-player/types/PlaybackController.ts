import { AudioPreset } from './AudioPreset';

export interface PlaybackController {
  isPlaying: () => boolean;
  currentTime: () => number;
  duration: () => number;
  rate: () => number;
  volume: () => number;
  audioPreset: () => AudioPreset;
  isLeveling: () => boolean;
  isAudioChanged: () => boolean;
  hasError: () => boolean;
  setAudioRef: (element: HTMLAudioElement) => void;
  togglePlay: () => void;
  skip: (seconds: number) => void;
  seek: (seconds: number, options?: { play?: boolean }) => void;
  cycleRate: () => void;
  setVolume: (percent: number) => void;
  setAudioPreset: (preset: AudioPreset) => void;
  toggleLeveling: () => void;
  resetAudio: () => void;
  resumeAudio: () => void;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: () => void;
  onDurationChange: () => void;
  onError: () => void;
}
