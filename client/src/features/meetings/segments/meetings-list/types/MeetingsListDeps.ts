import { MeetingCardData } from '@/features/meetings/types/MeetingCardData';

export interface MeetingsListDeps {
  cards: MeetingCardData[];
  isLoading: boolean;
  isEmpty: boolean;
  onOpen: (id: string) => void;
}
