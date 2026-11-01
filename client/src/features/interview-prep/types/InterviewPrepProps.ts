import type { InterviewLanguage } from '@schema';

import type { Tab } from '@/shared/ui/tabs';

import { PrepSectionKey } from './PrepSectionKey';

export interface InterviewPrepProps {
  resumeLabel: string;
  hasResume: boolean;
  vacancy: string;
  language: InterviewLanguage;
  onSelectLanguage: (language: InterviewLanguage) => void;
  isPreparing: boolean;
  canPrepare: boolean;
  isReady: boolean;
  errorMessage: string;
  sectionTabs: Tab<PrepSectionKey>[];
  activeSection: PrepSectionKey;
  activeItems: string[];
  onSelectSection: (key: PrepSectionKey) => void;
  onResumeSelected: (file: File) => void;
  onVacancyInput: (value: string) => void;
  onPrepare: () => void;
  onStart: () => void;
  onBack: () => void;
}
