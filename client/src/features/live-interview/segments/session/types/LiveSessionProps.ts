import { JSX } from 'solid-js';

import { LiveTurnView } from '../../../types/LiveTurnView';

export interface LiveSessionProps {
  header: JSX.Element;
  player?: JSX.Element;
  turns: LiveTurnView[];
  isEmpty: boolean;
  emptyLabel: string;
  onToggleDetails: (id: string) => void;
}
