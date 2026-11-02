import { InterviewLanguage } from '@schema';

import type { DropdownOption } from '@/shared/ui/dropdown';

export const LANGUAGE_OPTIONS: DropdownOption<InterviewLanguage>[] = [
  { label: 'Русский', value: InterviewLanguage.Ru },
  { label: 'English', value: InterviewLanguage.En },
];
