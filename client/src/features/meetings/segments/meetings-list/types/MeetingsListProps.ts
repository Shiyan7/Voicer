import { MeetingCardData } from '@/features/meetings/types/MeetingCardData';

export interface MeetingsListProps {
  items: MeetingCardData[];
  isLoading: boolean;
  isEmpty: boolean;
  hasMore: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  setTriggerRef: (element: HTMLElement) => void;
}
