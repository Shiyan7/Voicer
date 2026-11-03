import type { InterviewRecommendationsOutput } from '@schema';

export type BriefingSectionKey = Exclude<
  keyof InterviewRecommendationsOutput,
  '__typename'
>;
