import { SummaryStyle } from '@schema';

export interface SummarizeParams {
  meetingId: string;
  summaryStyle: SummaryStyle | null;
  isSummarizing: boolean;
  onStarted: () => void;
}
