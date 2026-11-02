import type { FormStore, SubmitHandler } from '@modular-forms/solid';
import type { InterviewLanguage, InterviewMode } from '@schema';

import type { Tab } from '@/shared/ui/tabs';

import type { PrepForm } from '../config/createPrepSchema';
import { PrepModeOption } from './PrepModeOption';
import { PrepSectionKey } from './PrepSectionKey';

export interface InterviewPrepProps {
  form: FormStore<PrepForm>;
  language: InterviewLanguage;
  languageLabel: string;
  onSelectLanguage: (language: InterviewLanguage) => void;
  modeOptions: PrepModeOption[];
  mode: InterviewMode;
  onSelectMode: (mode: InterviewMode) => void;
  prepareLabel: string;
  isPreparing: boolean;
  isReady: boolean;
  errorMessage: string;
  sectionTabs: Tab<PrepSectionKey>[];
  activeSection: PrepSectionKey;
  activeItems: string[];
  onSelectSection: (key: PrepSectionKey) => void;
  onPrepare: SubmitHandler<PrepForm>;
  onStart: () => void;
  onBack: () => void;
}
