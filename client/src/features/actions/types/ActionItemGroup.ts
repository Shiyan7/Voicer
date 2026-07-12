import { ActionItem } from '@/entities/meeting';

export type ActionItemGroup = {
  meetingId: string;
  title: string;
  meetingHref: string;
  items: ActionItem[];
};
