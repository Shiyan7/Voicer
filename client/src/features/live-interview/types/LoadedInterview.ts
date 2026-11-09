import { LiveSessionDetails } from './LiveSessionDetails';
import { LiveTurn } from './LiveTurn';

export interface LoadedInterview {
  details: LiveSessionDetails;
  turns: LiveTurn[];
}
