export interface SummarizeParams {
  meetingId: string;
  isSummarizing: boolean;
  onStarted: () => void;
}
