import { MeetingsSort } from '@schema';
import { useSearchParams } from '@solidjs/router';

import { ALL_SOURCES } from '../lib/getSourceOptions';

interface MeetingsSearchParams {
  page?: string;
  sort?: string;
  favorites?: string;
  source?: string;
}

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

  const isCustomSort = () => sort() !== MeetingsSort.DateDesc;

  const hasActiveFilters = () => favoritesOnly() || source() !== ALL_SOURCES;

  const update = (next: Omit<MeetingsSearchParams, 'page'>) =>
    setSearchParams({ ...next, page: undefined });

  const setSort = (value: MeetingsSort) =>
    update({ sort: value === MeetingsSort.DateDesc ? undefined : value });

  const toggleFavoritesOnly = () =>
    update({ favorites: favoritesOnly() ? undefined : '1' });

  const setSource = (value: string) =>
    update({ source: value === ALL_SOURCES ? undefined : value });

  const resetFilters = () =>
    update({ favorites: undefined, source: undefined });

  return {
    sort,
    favoritesOnly,
    source,
    isCustomSort,
    hasActiveFilters,
    setSort,
    toggleFavoritesOnly,
    setSource,
    resetFilters,
  };
};
