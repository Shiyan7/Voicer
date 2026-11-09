export interface LiveSessionBarProps {
  timerLabel: string;
  statusLabel: string;
  isAnswering: boolean;
  onCaptureCode: () => void;
  onAnswerNow: () => void;
  onStop: () => void;
}
