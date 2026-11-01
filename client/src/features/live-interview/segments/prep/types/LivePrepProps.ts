import { LivePastSessionView } from '../../../types/LivePastSessionView';
import { LivePrepSectionView } from '../../../types/LivePrepSectionView';

export interface LivePrepProps {
  resumeLabel: string;
  hasResume: boolean;
  vacancy: string;
  isPreparing: boolean;
  canPrepare: boolean;
  isReady: boolean;
  errorMessage: string;
  sections: LivePrepSectionView[];
  pastSessions: LivePastSessionView[];
  onResumeSelected: (event: Event) => void;
  onVacancyInput: (value: string) => void;
  onPrepare: () => void;
  onStart: () => void;
  onOpenPastSession: (id: string) => void;
}
