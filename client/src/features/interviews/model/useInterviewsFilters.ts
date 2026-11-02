import { InterviewSessionsSort } from '@schema';

import { useDateRangeFilter } from '@/shared/hooks/useDateRangeFilter';
import { useFilterParams } from '@/shared/hooks/useFilterParams';
import { useOptionFilter } from '@/shared/hooks/useOptionFilter';
import { useSortFilter } from '@/shared/hooks/useSortFilter';

import {
  MODE_VALUES,
  SORT_VALUES,
  STATUS_VALUES,
} from '../config/interviewsConfig';

export const useInterviewsFilters = () => {
  const params = useFilterParams();
  const { sort, isCustomSort, setSort } = useSortFilter(
    params,
    SORT_VALUES,
    InterviewSessionsSort.DateDesc,
  );
  const dateFilter = useDateRangeFilter(params);
  const statusFilter = useOptionFilter(params, 'status', STATUS_VALUES);
  const modeFilter = useOptionFilter(params, 'mode', MODE_VALUES);

  const hasActiveFilters = () =>
    statusFilter.isActive() ||
    modeFilter.isActive() ||
    dateFilter.hasDateFilter();

  const resetFilters = () =>
    params.clear(
      statusFilter.paramKey,
      modeFilter.paramKey,
      ...dateFilter.paramKeys,
    );

  return {
    sort,
    status: statusFilter.value,
    statusInput: statusFilter.activeValue,
    mode: modeFilter.value,
    modeInput: modeFilter.activeValue,
    dateRange: dateFilter.dateRange,
    isCustomSort,
    hasStatusFilter: statusFilter.isActive,
    hasModeFilter: modeFilter.isActive,
    hasActiveFilters,
    setSort,
    setStatus: statusFilter.set,
    setMode: modeFilter.set,
    setDateRange: dateFilter.setDateRange,
    resetFilters,
  };
};
