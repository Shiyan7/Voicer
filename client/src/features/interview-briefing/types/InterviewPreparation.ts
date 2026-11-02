import type { InterviewSessionOutput } from '@schema';

export type InterviewPreparation = Pick<
  InterviewSessionOutput,
  'id' | 'prepStatus' | 'title' | 'vacancyText' | 'recommendations'
>;
