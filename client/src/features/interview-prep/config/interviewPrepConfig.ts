import { InterviewLanguage } from '@schema';

import { DropdownOption } from '@/shared/ui/dropdown';

export const LANGUAGE_OPTIONS: DropdownOption<InterviewLanguage>[] = [
  { label: 'Русский', value: InterviewLanguage.Ru },
  { label: 'English', value: InterviewLanguage.En },
  { label: 'Українська', value: InterviewLanguage.Uk },
];
