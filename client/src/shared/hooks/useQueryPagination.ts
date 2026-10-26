import type { PagePaginationMetaOutput } from '@schema';
import { useSearchParams } from '@solidjs/router';

interface UseQueryPaginationOptions {
  limit?: number;
}

const DEFAULT_PAGE_LIMIT = 10;

export const useQueryPagination = (
  meta: () => PagePaginationMetaOutput | undefined,
  options?: UseQueryPaginationOptions,
) => {
  const limit = options?.limit ?? DEFAULT_PAGE_LIMIT;

  const [searchParams, setSearchParams] = useSearchParams<{ page?: string }>();

  const page = () => {
    const value = Number(searchParams.page);
    return Number.isInteger(value) && value > 0 ? value : 1;
  };

  const setPage = (next: number) =>
    setSearchParams({ page: next > 1 ? String(next) : undefined });

  const currentPage = () => meta()?.page ?? page();

  const hasPrevPage = () => Boolean(meta()?.hasPrevItems);

  const hasNextPage = () => Boolean(meta()?.hasNextItems);

  const goToPrevPage = () => {
    if (!hasPrevPage()) return;
    setPage(Math.max(1, page() - 1));
  };

  const goToNextPage = () => {
    if (!hasNextPage()) return;
    setPage(page() + 1);
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
