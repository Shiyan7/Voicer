import type { IconName } from '@/shared/ui/icon';

export interface InterviewRowData {
  id: string;
  href: string;
  title: string;
  icon: IconName;
  status: string | null;
  dateLabel: string;
  dateTitle: string;
}
