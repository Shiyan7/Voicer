import { InterviewSessionsSort } from '@schema';

import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const getInterviewSortOptions =
  (): DropdownOption<InterviewSessionsSort>[] => [
    {
      value: InterviewSessionsSort.DateDesc,
      label: i18n.t('filters.sort.date_desc'),
    },
    {
      value: InterviewSessionsSort.DateAsc,
      label: i18n.t('filters.sort.date_asc'),
    },
  ];
