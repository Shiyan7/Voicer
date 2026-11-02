import { LiveStatus } from './LiveStatus';
import { LiveTurn } from './LiveTurn';

export interface LiveConnectionHandlers {
  onTurn: (turn: Pick<LiveTurn, 'id'> & Partial<LiveTurn>) => void;
  onStatus: (status: LiveStatus) => void;
}
