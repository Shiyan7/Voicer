import type {
  InterviewPrepStatus,
  InterviewRecommendationsOutput,
} from '@schema';

export interface InterviewBriefingProps {
  title: string;
  status: InterviewPrepStatus;
  recommendations: InterviewRecommendationsOutput | null | undefined;
  vacancyText: string | undefined;
  onRetry: () => void;
  onStart: () => void;
  onBack: () => void;
}
