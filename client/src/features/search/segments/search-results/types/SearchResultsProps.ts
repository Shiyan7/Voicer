import type { SearchSort } from '@schema';

import { SearchResultView } from '@/features/search/types/SearchResultView';
import { DropdownOption } from '@/shared/ui/dropdown';

export interface SearchResultsProps {
  results: SearchResultView[];
  total: number;
  activeIndex: number;
  isLoading: boolean;
  isEmpty: boolean;
  isIdle: boolean;
  emptyLabel: string;
  sort: SearchSort;
  sortLabel: string;
  sortOptions: DropdownOption<SearchSort>[];
  onSortChange: (value: SearchSort) => void;
  onSelect: (href: string) => void;
  onHover: (index: number) => void;
  onLoadMore: () => void;
}
