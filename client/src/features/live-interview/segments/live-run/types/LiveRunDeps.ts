import { LiveTurn } from '../../../types/LiveTurn';

export interface LiveRunDeps {
  sessionId: string;
  initialTurns: LiveTurn[];
  onFinished: () => void;
}
