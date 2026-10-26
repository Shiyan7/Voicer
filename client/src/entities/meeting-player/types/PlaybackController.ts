export interface PlaybackController {
  isPlaying: () => boolean;
  currentTime: () => number;
  duration: () => number;
  rate: () => number;
  hasError: () => boolean;
  setAudioRef: (element: HTMLAudioElement) => void;
  togglePlay: () => void;
  skip: (seconds: number) => void;
  seek: (seconds: number, options?: { play?: boolean }) => void;
  cycleRate: () => void;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: () => void;
  onDurationChange: () => void;
  onError: () => void;
}
