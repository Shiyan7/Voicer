import { SummaryStyle } from '@schema';

export interface SummarizeDeps {
  meetingId: string;
  summaryStyle: SummaryStyle | null;
  isSummarizing: boolean;
  onStarted: () => void;
}
