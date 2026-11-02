import type { InterviewSessionOutput } from '@schema';

export interface InterviewBriefingProps {
  title: string;
  isPreparing: boolean;
  isFailed: boolean;
  briefing:
    | Pick<InterviewSessionOutput, 'vacancyText' | 'recommendations'>
    | undefined;
  onRetry: () => void;
  onStart: () => void;
  onBack: () => void;
}
