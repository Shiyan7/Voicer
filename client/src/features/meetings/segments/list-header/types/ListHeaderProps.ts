import type { MeetingsSort } from '@schema';

import type { DateRange, DateRangePreset } from '@/shared/ui/date-range-picker';
import { DropdownOption } from '@/shared/ui/dropdown';
import type { IconName } from '@/shared/ui/icon';

export interface ListHeaderProps {
  count: string;
  favoritesOnly: boolean;
  sort: MeetingsSort;
  source: string;
  hasSourceFilter: boolean;
  dateRange: DateRange | null;
  dateRangeLabel: string;
  dateRangePresets: DateRangePreset[];
  hasDateFilter: boolean;
  isCustomSort: boolean;
  favoritesIcon: IconName;
  showSourceFilter: boolean;
  sortOptions: DropdownOption<MeetingsSort>[];
  sourceOptions: DropdownOption<string>[];
  onToggleFavorites: () => void;
  onSortChange: (value: MeetingsSort) => void;
  onSourceChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | null) => void;
  onDateRangeClear: () => void;
}
