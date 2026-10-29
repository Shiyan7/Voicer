import { useQueryPagination } from '@/shared/hooks/useQueryPagination';
import { i18n } from '@/shared/i18n';
import { authRoot } from '@/shared/roots/authRoot';

import { meetingsPageQuery } from '../api/meetingsPageQuery';
import { meetingsStatsQuery } from '../api/meetingsStatsQuery';
import { formatDateRange } from '../lib/formatDateRange';
import { getDateRangePresets } from '../lib/getDateRangePresets';
import { getSortOptions } from '../lib/getSortOptions';
import { getSourceOptions } from '../lib/getSourceOptions';
import { mapMeetingCards } from '../lib/mapMeetingCards';
import { toDateRangeInput } from '../lib/toDateRangeInput';
import { useMeetingCapture } from './useMeetingCapture';
import { useMeetingDelete } from './useMeetingDelete';
import { useMeetingsFilters } from './useMeetingsFilters';
import { useStatsBanner } from './useStatsBanner';

export const useMeetingsPage = () => {
  const filters = useMeetingsFilters();
  const pagination = useQueryPagination(() => meetingsPage()?.meta);

  const [meetingsResult] = meetingsPageQuery(
    () => ({
      input: {
        page: pagination.page(),
        limit: pagination.limit,
        favoritesOnly: filters.favoritesOnly(),
        sort: filters.sort(),
        sources: filters.hasSourceFilter() ? [filters.source()] : null,
        ...toDateRangeInput(filters.dateRange()),
      },
    }),
    { pause: () => !authRoot.isAuth },
  );

  const [statsResult] = meetingsStatsQuery({
    pause: () => !authRoot.isAuth,
  });
  const stats = () => statsResult.data?.meetingsStats;

  const isStatsLoading = () => statsResult.fetching && !stats();

  const isAuthorized = () => authRoot.isAuth;

  const meetingsPage = () => meetingsResult.data?.meetingsPage;

  const items = () => mapMeetingCards(meetingsPage()?.items);

  const isLoading = () => meetingsResult.fetching && !items().length;

  const isEmpty = () => !meetingsResult.fetching && items().length === 0;

  const emptyLabel = () => {
    if (filters.hasSourceFilter() || filters.hasDateFilter()) {
      return i18n.t('meetings.empty_filtered');
    }
    if (filters.favoritesOnly()) return i18n.t('meetings.empty_favorites');
    return i18n.t('meetings.empty');
  };

  const favoritesIcon = () =>
    filters.favoritesOnly()
      ? 'navigation:bookmark-solid'
      : 'navigation:bookmark';

  const sourceOptions = () => getSourceOptions(stats()?.sources ?? []);

  const showSourceFilter = () => sourceOptions().length > 1;

  const dateRangeLabel = () => formatDateRange(filters.dateRange());

  const totalCount = () => String(meetingsPage()?.meta.total ?? 0);

  return {
    ...useMeetingCapture(),
    ...useMeetingDelete(),
    banner: useStatsBanner(stats, isStatsLoading),
    isAuthorized,
    filters,
    items,
    isLoading,
    isEmpty,
    emptyLabel,
    favoritesIcon,
    sourceOptions,
    showSourceFilter,
    totalCount,
    dateRangeLabel,
    dateRangePresets: getDateRangePresets,
    sortOptions: getSortOptions,
    currentPage: pagination.currentPage,
    hasPrevPage: pagination.hasPrevPage,
    hasNextPage: pagination.hasNextPage,
    goToPrevPage: pagination.goToPrevPage,
    goToNextPage: pagination.goToNextPage,
  };
};
