export interface RecordingBarProps {
  formattedSeconds: string;
  level: number;
  isPaused: boolean;
  pauseLabel: string;
  onTogglePause: () => void;
  onStop: () => void;
}
