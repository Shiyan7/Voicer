import { JSX } from 'solid-js';

import { LiveTurnView } from '../../../types/LiveTurnView';

export interface LiveSessionProps {
  timerLabel: string;
  statusLabel: string;
  isAnswering: boolean;
  isEmpty: boolean;
  turns: LiveTurnView[];
  onToggleDetails: (id: string) => void;
  onAnswerNow: () => void;
  onCaptureCode: () => void;
  onStop: () => void;
  isReadOnly: boolean;
  player?: JSX.Element;
  reviewActions?: JSX.Element;
  reviewTitle?: string;
  onBack: () => void;
}
