import { LiveSessionDetails } from '../../../types/LiveSessionDetails';
import { LiveTurn } from '../../../types/LiveTurn';

export interface ReviewDeps {
  details: LiveSessionDetails;
  turns: LiveTurn[];
  onBack: () => void;
}
