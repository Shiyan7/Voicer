import { MeetingCardData } from '../../../types/MeetingCardData';

export interface MeetingsListProps {
  items: MeetingCardData[];
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  canResetFilters: boolean;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onDelete: (id: string) => void;
  onResetFilters: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}
