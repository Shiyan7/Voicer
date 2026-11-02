import type { InterviewPrepStatus } from '@schema';
import type { JSX } from 'solid-js';

export interface BriefingLayoutProps {
  title: string;
  status: InterviewPrepStatus;
  hasBriefing: boolean;
  vacancy: JSX.Element;
  sections: JSX.Element;
  onRetry: () => void;
  onStart: () => void;
  onBack: () => void;
}
