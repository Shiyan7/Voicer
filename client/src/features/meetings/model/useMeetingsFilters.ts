import { MeetingsSort } from '@schema';
import { useSearchParams } from '@solidjs/router';

import type { DateRange } from '@/shared/ui/date-range-picker';

import { ALL_SOURCES } from '../lib/getSourceOptions';
import { parseDateRange } from '../lib/parseDateRange';

type MeetingsSearchParams = {
  page?: string;
  sort?: string;
  favorites?: string;
  source?: string;
  from?: string;
  to?: string;
};

const SORT_VALUES = Object.values(MeetingsSort) as string[];

export const useMeetingsFilters = () => {
  const [searchParams, setSearchParams] =
    useSearchParams<MeetingsSearchParams>();

  const sort = () =>
    SORT_VALUES.includes(searchParams.sort ?? '')
      ? (searchParams.sort as MeetingsSort)
      : MeetingsSort.DateDesc;

  const favoritesOnly = () => searchParams.favorites === '1';

  const source = () => searchParams.source ?? ALL_SOURCES;

  const dateRange = () => parseDateRange(searchParams.from, searchParams.to);

  const isCustomSort = () => sort() !== MeetingsSort.DateDesc;

  const hasSourceFilter = () => source() !== ALL_SOURCES;

  const hasDateFilter = () => dateRange() !== null;

  const hasActiveFilters = () =>
    favoritesOnly() || hasSourceFilter() || hasDateFilter();

  const update = (next: Omit<MeetingsSearchParams, 'page'>) =>
    setSearchParams({ ...next, page: undefined });

  const setSort = (value: MeetingsSort) =>
    update({ sort: value === MeetingsSort.DateDesc ? undefined : value });

  const toggleFavoritesOnly = () =>
    update({ favorites: favoritesOnly() ? undefined : '1' });

  const setSource = (value: string) =>
    update({ source: value === ALL_SOURCES ? undefined : value });

  const setDateRange = (range: DateRange | null) =>
    update({ from: range?.from, to: range?.to });

  const clearDateRange = () => setDateRange(null);

  const resetFilters = () =>
    update({
      favorites: undefined,
      source: undefined,
      from: undefined,
      to: undefined,
    });

  return {
    sort,
    favoritesOnly,
    source,
    dateRange,
    isCustomSort,
    hasSourceFilter,
    hasDateFilter,
    hasActiveFilters,
    setSort,
    toggleFavoritesOnly,
    setSource,
    setDateRange,
    clearDateRange,
    resetFilters,
  };
};
