import type { InterviewRecommendationsOutput } from '@schema';

export const BRIEFING_SECTIONS = {
  topics: 'topics',
  questions: 'likelyQuestions',
  emphasis: 'emphasize',
} as const satisfies Record<
  string,
  Exclude<keyof InterviewRecommendationsOutput, '__typename'>
>;

export const TITLE_DOTS_MAX = 3;

export const TITLE_DOTS_INTERVAL_MS = 500;
