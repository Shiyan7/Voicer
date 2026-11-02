import type { FormStore, SubmitHandler } from '@modular-forms/solid';
import type { InterviewLanguage, InterviewMode } from '@schema';

import type { PrepForm } from '../config/createPrepSchema';
import { PrepModeOption } from './PrepModeOption';
import { PrepResumeOption } from './PrepResumeOption';

export interface InterviewPrepProps {
  form: FormStore<PrepForm>;
  language: InterviewLanguage;
  languageLabel: string;
  onSelectLanguage: (language: InterviewLanguage) => void;
  modeOptions: PrepModeOption[];
  mode: InterviewMode;
  onSelectMode: (mode: InterviewMode) => void;
  submitLabel: string;
  resumeOptions: PrepResumeOption[];
  selectedResumeId: string | undefined;
  selectedResumeLabel: string | undefined;
  onSelectResume: (id: string) => void;
  isSubmitting: boolean;
  errorMessage: string;
  onSubmit: SubmitHandler<PrepForm>;
  onBack: () => void;
}
