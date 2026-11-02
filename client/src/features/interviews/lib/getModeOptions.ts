import { InterviewMode } from '@schema';

import { ALL_FILTER_VALUE } from '@/shared/hooks/config/ALL_FILTER_VALUE';
import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const getModeOptions = (): DropdownOption<
  InterviewMode | typeof ALL_FILTER_VALUE
>[] => [
  { value: ALL_FILTER_VALUE, label: i18n.t('live.mode_filter.all') },
  { value: InterviewMode.Real, label: i18n.t('live.mode_filter.real') },
  { value: InterviewMode.Mock, label: i18n.t('live.mode_filter.mock') },
];
