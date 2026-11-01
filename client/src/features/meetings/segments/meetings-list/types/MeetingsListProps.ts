import type { QueryPagination } from '@/shared/hooks/useQueryPagination';

import { MeetingCardData } from '../../../types/MeetingCardData';

export interface MeetingsListProps {
  items: MeetingCardData[];
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  canResetFilters: boolean;
  pagination: QueryPagination;
  onDelete: (id: string) => void;
  onResetFilters: () => void;
}
