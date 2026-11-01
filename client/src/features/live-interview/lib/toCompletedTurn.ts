import type { InterviewTurnOutput } from '@schema';

import { LiveTurn } from '../types/LiveTurn';
import { splitAnswer } from './splitAnswer';

export const toCompletedTurn = (
  turn: Pick<InterviewTurnOutput, 'id' | 'question' | 'answer'>,
): LiveTurn => ({
  id: turn.id,
  question: turn.question,
  isQuestionFinal: true,
  ...splitAnswer(turn.answer),
  isDone: true,
});
