import { LiveStatus } from './LiveStatus';
import { LiveTurn } from './LiveTurn';

export interface LiveSourceHandlers {
  onTurn: (turn: Pick<LiveTurn, 'id'> & Partial<LiveTurn>) => void;
  onStatus: (status: LiveStatus) => void;
}
