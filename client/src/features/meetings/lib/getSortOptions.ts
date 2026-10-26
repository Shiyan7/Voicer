import { MeetingsSort } from '@schema';

import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const getSortOptions = (): DropdownOption<MeetingsSort>[] => [
  { value: MeetingsSort.DateDesc, label: i18n.t('meetings.sort.date_desc') },
  { value: MeetingsSort.DateAsc, label: i18n.t('meetings.sort.date_asc') },
  {
    value: MeetingsSort.DurationDesc,
    label: i18n.t('meetings.sort.duration_desc'),
  },
  {
    value: MeetingsSort.DurationAsc,
    label: i18n.t('meetings.sort.duration_asc'),
  },
];
