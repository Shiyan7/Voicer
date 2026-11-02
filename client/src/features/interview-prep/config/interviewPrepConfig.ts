import {
  InterviewLanguage,
  type InterviewRecommendationsOutput,
} from '@schema';

import type { Tab } from '@/shared/ui/tabs';

export const PREP_SECTIONS = {
  topics: 'topics',
  questions: 'likelyQuestions',
  emphasis: 'emphasize',
} as const satisfies Record<
  string,
  Exclude<keyof InterviewRecommendationsOutput, '__typename'>
>;

export const LANGUAGE_TABS: Tab<InterviewLanguage>[] = [
  { label: 'RU', value: InterviewLanguage.Ru },
  { label: 'EN', value: InterviewLanguage.En },
];
