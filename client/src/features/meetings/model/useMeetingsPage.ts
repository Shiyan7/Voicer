import { useMeetingDelete } from '@/entities/meeting';
import { useListStatus } from '@/shared/hooks/useListStatus';
import { useQueryPagination } from '@/shared/hooks/useQueryPagination';
import { i18n } from '@/shared/i18n';
import { toDateRangeInput } from '@/shared/lib/date-range';
import { authRoot } from '@/shared/roots/authRoot';

import { meetingsPageQuery } from '../api/meetingsPageQuery';
import { meetingsStatsQuery } from '../api/meetingsStatsQuery';
import { getSortOptions } from '../lib/getSortOptions';
import { getSourceOptions } from '../lib/getSourceOptions';
import { mapMeetingCards } from '../lib/mapMeetingCards';
import { useMeetingsFilters } from './useMeetingsFilters';

export const useMeetingsPage = () => {
  const filters = useMeetingsFilters();
  const pagination = useQueryPagination(() => meetingsPage()?.meta);
  const { isDeleting, request, confirm, cancel } = useMeetingDelete();

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

  const { isLoading, isEmpty, totalCount } = useListStatus({
    isFetching: () => meetingsResult.fetching,
    itemCount: () => items().length,
    total: () => meetingsPage()?.meta.total,
  });

  const emptyLabel = () => {
    if (filters.hasSourceFilter() || filters.hasDateFilter()) {
      return i18n.t('filters.empty');
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

  return {
    stats,
    isStatsLoading,
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
    sortOptions: getSortOptions,
    pagination,
    isDeleting,
    requestDelete: request,
    confirmDelete: confirm,
    cancelDelete: cancel,
  };
};
