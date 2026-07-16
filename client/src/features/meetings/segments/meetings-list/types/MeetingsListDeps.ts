import { MeetingCardData } from '@/features/meetings/types/MeetingCardData';

export interface MeetingsListDeps {
  items: MeetingCardData[];
  isLoading: boolean;
  isEmpty: boolean;
  onOpen: (id: string) => void;
}
