import { InterviewSessionsSort } from '@schema';

import { useDateRangeFilter } from '@/shared/hooks/useDateRangeFilter';
import { useFilterParams } from '@/shared/hooks/useFilterParams';
import { useOptionFilter } from '@/shared/hooks/useOptionFilter';
import { useSortFilter } from '@/shared/hooks/useSortFilter';

import { SORT_VALUES, STATUS_VALUES } from '../config/interviewsConfig';

export const useInterviewsFilters = () => {
  const params = useFilterParams();
  const { sort, isCustomSort, setSort } = useSortFilter(
    params,
    SORT_VALUES,
    InterviewSessionsSort.DateDesc,
  );
  const dateFilter = useDateRangeFilter(params);
  const statusFilter = useOptionFilter(params, 'status', STATUS_VALUES);

  const hasActiveFilters = () =>
    statusFilter.isActive() || dateFilter.hasDateFilter();

  const resetFilters = () =>
    params.clear(statusFilter.paramKey, ...dateFilter.paramKeys);

  return {
    sort,
    status: statusFilter.value,
    statusInput: statusFilter.activeValue,
    dateRange: dateFilter.dateRange,
    isCustomSort,
    hasStatusFilter: statusFilter.isActive,
    hasActiveFilters,
    setSort,
    setStatus: statusFilter.set,
    setDateRange: dateFilter.setDateRange,
    resetFilters,
  };
};
