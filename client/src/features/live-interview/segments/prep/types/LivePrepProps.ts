import type { InterviewSessionView } from '@/entities/interview-session';
import type { Tab } from '@/shared/ui/tabs';

import { LivePrepSectionKey } from '../../../types/LivePrepSectionKey';

export interface LivePrepProps {
  resumeLabel: string;
  hasResume: boolean;
  vacancy: string;
  isPreparing: boolean;
  canPrepare: boolean;
  isReady: boolean;
  errorMessage: string;
  sectionTabs: Tab<LivePrepSectionKey>[];
  activeSection: LivePrepSectionKey;
  activeItems: string[];
  onSelectSection: (key: LivePrepSectionKey) => void;
  pastSessions: InterviewSessionView[];
  onResumeSelected: (file: File) => void;
  onVacancyInput: (value: string) => void;
  onPrepare: () => void;
  onStart: () => void;
  onOpenPastSession: (id: string) => void;
}
