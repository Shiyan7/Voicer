import { LiveAnswerContent } from './LiveAnswerContent';

export interface LiveAnswerUpdate extends LiveAnswerContent {
  turnId: string;
  isDone: boolean;
}
