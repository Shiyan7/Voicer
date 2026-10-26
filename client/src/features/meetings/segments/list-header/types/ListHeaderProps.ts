import type { MeetingsSort } from '@schema';

import { DropdownOption } from '@/shared/ui/dropdown';
import type { IconName } from '@/shared/ui/icon';

export interface ListHeaderProps {
  favoritesOnly: boolean;
  sort: MeetingsSort;
  source: string;
  hasSourceFilter: boolean;
  isCustomSort: boolean;
  favoritesIcon: IconName;
  showSourceFilter: boolean;
  sortOptions: DropdownOption<MeetingsSort>[];
  sourceOptions: DropdownOption<string>[];
  onToggleFavorites: () => void;
  onSortChange: (value: MeetingsSort) => void;
  onSourceChange: (value: string) => void;
}
