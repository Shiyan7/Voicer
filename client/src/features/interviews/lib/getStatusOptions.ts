import { InterviewSessionStatus } from '@schema';

import { ALL_FILTER_VALUE } from '@/shared/hooks/config/ALL_FILTER_VALUE';
import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const getStatusOptions = (): DropdownOption<
  InterviewSessionStatus | typeof ALL_FILTER_VALUE
>[] => [
  { value: ALL_FILTER_VALUE, label: i18n.t('live.status_filter.all') },
  {
    value: InterviewSessionStatus.Finished,
    label: i18n.t('live.status_filter.finished'),
  },
  {
    value: InterviewSessionStatus.Unfinished,
    label: i18n.t('live.status_filter.unfinished'),
  },
];
