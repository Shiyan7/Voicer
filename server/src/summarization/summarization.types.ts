export interface SummarizedKeyPoint {
  text: string;
  atMs: number | null;
}

export interface SummarizedActionItem {
  text: string;
  atMs: number | null;
  speakerIndex: number | null;
}

export interface MeetingSummary {
  title: string;
  keyPoints: SummarizedKeyPoint[];
  actionItems: SummarizedActionItem[];
}
