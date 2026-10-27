import { MeetingCardData } from '../../../types/MeetingCardData';

export interface MeetingCardProps {
  card: MeetingCardData;
  onDelete: (id: string) => void;
}
