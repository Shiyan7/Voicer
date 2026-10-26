import { MeetingCardData } from '@/features/meetings/types/MeetingCardData';

export interface MeetingsListProps {
  items: MeetingCardData[];
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onDelete: (id: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}
