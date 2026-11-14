import { LiveTurnView } from '../../../types/LiveTurnView';

export interface LiveTurnCardProps {
  turn: LiveTurnView;
  onToggleDetails: (id: string) => void;
  onOpenImage: (id: string) => void;
}
