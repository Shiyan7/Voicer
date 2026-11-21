export interface RecordingBarProps {
  isVisible: boolean;
  formattedSeconds: string;
  level: number;
  isPaused: boolean;
  pauseLabel: string;
  onTogglePause: () => void;
  onStop: () => void;
}
