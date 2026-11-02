import type { InterviewLanguage, InterviewMode } from '@schema';

import type { Tab } from '@/shared/ui/tabs';

import { PrepModeOption } from './PrepModeOption';
import { PrepSectionKey } from './PrepSectionKey';

export interface InterviewPrepProps {
  resumeLabel: string;
  hasResume: boolean;
  vacancy: string;
  language: InterviewLanguage;
  languageLabel: string;
  onSelectLanguage: (language: InterviewLanguage) => void;
  modeOptions: PrepModeOption[];
  mode: InterviewMode | undefined;
  onSelectMode: (mode: InterviewMode) => void;
  prepareLabel: string;
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
