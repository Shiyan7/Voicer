import type { InterviewRecommendationsOutput } from '@schema';

import type { LiveTurn } from '../types/LiveTurn';

export const LIVE_AUDIO_PATH = '/live-audio';
export const SHORT_ANSWER_MIN_LENGTH = 80;

export const PREP_SECTIONS = {
  topics: 'topics',
  questions: 'likelyQuestions',
  emphasis: 'emphasize',
} as const satisfies Record<
  string,
  Exclude<keyof InterviewRecommendationsOutput, '__typename'>
>;

export const EMPTY_TURN: Omit<LiveTurn, 'id'> = {
  question: '',
  isQuestionFinal: false,
  answer: '',
};
