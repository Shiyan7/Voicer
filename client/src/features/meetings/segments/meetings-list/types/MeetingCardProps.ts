import { MeetingCardData } from '@/features/meetings/types/MeetingCardData';

export interface MeetingCardProps {
  card: MeetingCardData;
  onDelete: (id: string) => void;
}
