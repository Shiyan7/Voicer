import type { InterviewTurnOutput } from '@schema';

import { LiveTurn } from '../types/LiveTurn';

export const toCompletedTurn = (
  turn: Pick<InterviewTurnOutput, 'id' | 'question' | 'answer'>,
): LiveTurn => ({
  id: turn.id,
  question: turn.question,
  answer: turn.answer,
  isQuestionFinal: true,
});
