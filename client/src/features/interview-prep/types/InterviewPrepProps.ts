import type { InterviewLanguage } from '@schema';

import { PrepResumeOption } from './PrepResumeOption';

export interface InterviewPrepProps {
  resumeLabel: string;
  hasResume: boolean;
  resumeOptions: PrepResumeOption[];
  selectedResumeId: string | undefined;
  onSelectResume: (id: string) => void;
  isDeletingResume: boolean;
  onRequestResumeDelete: (id: string) => void;
  onConfirmResumeDelete: () => void;
  onCancelResumeDelete: () => void;
  vacancy: string;
  language: InterviewLanguage;
  languageLabel: string;
  onSelectLanguage: (language: InterviewLanguage) => void;
  canPrepare: boolean;
  errorMessage: string;
  onResumeSelected: (file: File) => void;
  onVacancyInput: (value: string) => void;
  onPrepare: () => void;
  onBack: () => void;
}
