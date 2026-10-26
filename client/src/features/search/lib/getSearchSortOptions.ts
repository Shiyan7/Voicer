import { SearchSort } from '@schema';

import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const getSearchSortOptions = (): DropdownOption<SearchSort>[] => [
  { value: SearchSort.Relevance, label: i18n.t('search.sort.relevance') },
  { value: SearchSort.Recent, label: i18n.t('search.sort.recent') },
];
