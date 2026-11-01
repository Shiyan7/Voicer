import { useInterviewDelete } from '@/entities/interview-session';
import { useQueryPagination } from '@/shared/hooks/useQueryPagination';
import { i18n } from '@/shared/i18n';
import { toDateRangeInput } from '@/shared/lib/date-range';

import { interviewSessionsPageQuery } from '../api/interviewSessionsPageQuery';
import { getInterviewSortOptions } from '../lib/getInterviewSortOptions';
import { getStatusOptions } from '../lib/getStatusOptions';
import { mapInterviewRows } from '../lib/mapInterviewRows';
import { useInterviewsFilters } from './useInterviewsFilters';

export function useInterviews() {
  const filters = useInterviewsFilters();
  const { isDeleting, request, confirm, cancel } = useInterviewDelete();
  const pagination = useQueryPagination(() => sessionsPage()?.meta);

  const [sessionsState] = interviewSessionsPageQuery(() => ({
    input: {
      page: pagination.page(),
      limit: pagination.limit,
      sort: filters.sort(),
      status: filters.statusInput(),
      ...toDateRangeInput(filters.dateRange()),
    },
  }));

  const sessionsPage = () => sessionsState.data?.interviewSessionsPage;

  const rows = () => mapInterviewRows(sessionsPage()?.items ?? []);

  const isLoading = () => sessionsState.fetching && !rows().length;

  const isEmpty = () => !sessionsState.fetching && rows().length === 0;

  const emptyLabel = () =>
    filters.hasActiveFilters() ? i18n.t('filters.empty') : i18n.t('live.empty');

  const totalCount = () => String(sessionsPage()?.meta.total ?? 0);

  return {
    filters,
    rows,
    isLoading,
    isEmpty,
    emptyLabel,
    totalCount,
    statusOptions: getStatusOptions,
    sortOptions: getInterviewSortOptions,
    pagination,
    isDeleting,
    requestDelete: request,
    confirmDelete: confirm,
    cancelDelete: cancel,
  };
}
