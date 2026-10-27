import { MeetingStatus, SummaryStyle } from '@schema';

export interface MeetingDetails {
  id: string;
  title: string;
  customTitle: string | null;
  sourceLabel: string | null;
  status: MeetingStatus;
  audioUrl: string | null;
  durationSec: number | null;
  isFavorite: boolean;
  summaryStyle: SummaryStyle | null;
  summarizationFailed: boolean;
  startedAt: string;
}
