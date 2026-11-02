import { ParentProps, Show } from 'solid-js';

import type { QueryPagination } from '@/shared/hooks/useQueryPagination';
import { ResetFiltersButton } from '@/shared/ui/list-filters';
import { Pagination } from '@/shared/ui/pagination';

import { ItemList } from './ItemList';

interface PagedItemListProps extends ParentProps {
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  canResetFilters: boolean;
  pagination: QueryPagination;
  onResetFilters: () => void;
}

export function PagedItemList(props: PagedItemListProps) {
  return (
    <ItemList
      isLoading={props.isLoading}
      isEmpty={props.isEmpty}
      emptyLabel={props.emptyLabel}
      emptyAction={
        <Show when={props.canResetFilters}>
          <ResetFiltersButton onClick={props.onResetFilters} />
        </Show>
      }
      footer={
        <Pagination
          page={props.pagination.currentPage()}
          hasPrev={props.pagination.hasPrevPage()}
          hasNext={props.pagination.hasNextPage()}
          onPrev={props.pagination.goToPrevPage}
          onNext={props.pagination.goToNextPage}
        />
      }
    >
      {props.children}
    </ItemList>
  );
}
