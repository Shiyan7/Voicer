import type { PagePaginationMetaOutput } from '@schema';
import { createSignal } from 'solid-js';

interface UseQueryPaginationOptions {
  limit?: number;
  initialPage?: number;
}

const DEFAULT_PAGE_LIMIT = 10;

export const useQueryPagination = (
  meta: () => PagePaginationMetaOutput | undefined,
  options?: UseQueryPaginationOptions,
) => {
  const limit = options?.limit ?? DEFAULT_PAGE_LIMIT;

  const [page, setPage] = createSignal(options?.initialPage ?? 1);

  const currentPage = () => meta()?.page ?? page();

  const hasPrevPage = () => Boolean(meta()?.hasPrevItems);

  const hasNextPage = () => Boolean(meta()?.hasNextItems);

  const goToPrevPage = () => {
    if (!hasPrevPage()) return;
    setPage((current) => Math.max(1, current - 1));
  };

  const goToNextPage = () => {
    if (!hasNextPage()) return;
    setPage((current) => current + 1);
  };

  return {
    page,
    limit,
    currentPage,
    hasPrevPage,
    hasNextPage,
    goToPrevPage,
    goToNextPage,
  };
};
