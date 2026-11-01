import { MeetingsSort } from '@schema';

import { useDateRangeFilter } from '@/shared/hooks/useDateRangeFilter';
import { useFilterParams } from '@/shared/hooks/useFilterParams';
import { useOptionFilter } from '@/shared/hooks/useOptionFilter';
import { useSortFilter } from '@/shared/hooks/useSortFilter';

const SORT_VALUES = Object.values(MeetingsSort);
const FAVORITES_PARAM = 'favorites';

export const useMeetingsFilters = () => {
  const params = useFilterParams();
  const { sort, isCustomSort, setSort } = useSortFilter(
    params,
    SORT_VALUES,
    MeetingsSort.DateDesc,
  );
  const dateFilter = useDateRangeFilter(params);
  const sourceFilter = useOptionFilter<string>(params, 'source');

  const favoritesOnly = () => params.read(FAVORITES_PARAM) === '1';

  const hasActiveFilters = () =>
    favoritesOnly() || sourceFilter.isActive() || dateFilter.hasDateFilter();

  const toggleFavoritesOnly = () =>
    params.update({ [FAVORITES_PARAM]: favoritesOnly() ? undefined : '1' });

  const resetFilters = () =>
    params.clear(
      FAVORITES_PARAM,
      sourceFilter.paramKey,
      ...dateFilter.paramKeys,
    );

  return {
    sort,
    favoritesOnly,
    source: sourceFilter.value,
    dateRange: dateFilter.dateRange,
    isCustomSort,
    hasSourceFilter: sourceFilter.isActive,
    hasDateFilter: dateFilter.hasDateFilter,
    hasActiveFilters,
    setSort,
    toggleFavoritesOnly,
    setSource: sourceFilter.set,
    setDateRange: dateFilter.setDateRange,
    resetFilters,
  };
};
