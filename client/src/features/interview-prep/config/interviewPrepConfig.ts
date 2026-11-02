import {
  InterviewLanguage,
  type InterviewRecommendationsOutput,
} from '@schema';

import { DropdownOption } from '@/shared/ui/dropdown';

export const PREP_SECTIONS = {
  topics: 'topics',
  questions: 'likelyQuestions',
  emphasis: 'emphasize',
} as const satisfies Record<
  string,
  Exclude<keyof InterviewRecommendationsOutput, '__typename'>
>;

export const LANGUAGE_OPTIONS: DropdownOption<InterviewLanguage>[] = [
  { label: 'Русский', value: InterviewLanguage.Ru },
  { label: 'English', value: InterviewLanguage.En },
  { label: 'Українська', value: InterviewLanguage.Uk },
];

export const PREP_MODE_STORAGE_KEY = 'interview-prep-mode';
