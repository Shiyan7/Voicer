import type { FormStore } from '@modular-forms/solid';
import type { InterviewLanguage } from '@schema';
import type { JSX } from 'solid-js';

import { InterviewPrepForm } from '../../../config/createInterviewPrepSchema';

export interface PrepFormProps {
  form: FormStore<InterviewPrepForm>;
  resumePicker: JSX.Element;
  language: InterviewLanguage;
  languageLabel: string;
  onSelectLanguage: (language: InterviewLanguage) => void;
  errorMessage: string;
  onPrepare: (values: InterviewPrepForm) => void;
  onBack: () => void;
}
