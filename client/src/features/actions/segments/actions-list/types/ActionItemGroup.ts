import { ActionItemData } from '@/entities/action-item';

export type ActionItemGroup = {
  meetingId: string;
  title: string;
  meetingHref: string;
  items: ActionItemData[];
};
