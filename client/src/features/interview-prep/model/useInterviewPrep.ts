import { createFormStore, setValue } from '@modular-forms/solid';
import { InterviewLanguage } from '@schema';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';

import { createInterviewSessionMutation } from '../api/createInterviewSessionMutation';
import { InterviewPrepForm } from '../config/createInterviewPrepSchema';
import { LANGUAGE_OPTIONS } from '../config/interviewPrepConfig';
import { validateInterviewPrep } from '../lib/validateInterviewPrep';
import { ResumeSelection } from '../types/ResumeSelection';
import { useResumePicker } from './useResumePicker';

export function useInterviewPrep() {
  const navigate = useNavigate();
  const [resume, setResumeSelection] = createSignal<ResumeSelection>();
  const [language, setLanguage] = createSignal(InterviewLanguage.Ru);
  const [hasError, setHasError] = createSignal(false);
  const [createState, createSession] = createInterviewSessionMutation();

  const form = createFormStore<InterviewPrepForm>({
    initialValues: { vacancy: '' },
    validate: validateInterviewPrep,
    revalidateOn: 'input',
  });

  const languageLabel = () =>
    LANGUAGE_OPTIONS.find((option) => option.value === language())?.label ?? '';

  const errorMessage = () => (hasError() ? i18n.t('live.prep.error') : '');

  const setResume = (selection: ResumeSelection | undefined) => {
    setResumeSelection(selection);
    setValue(
      form,
      'resumeFile',
      selection?.kind === 'file' ? selection.file : undefined,
    );
    setValue(
      form,
      'resumeSessionId',
      selection?.kind === 'saved' ? selection.id : undefined,
    );
  };

  const resumePicker = useResumePicker(resume, setResume);

  const goBack = () => navigate(paths.live);

  const prepare = async (values: InterviewPrepForm) => {
    if (createState.fetching) return;
    setHasError(false);
    const response = await createSession({
      resume: values.resumeFile,
      resumeSessionId: values.resumeSessionId,
      vacancy: values.vacancy.trim(),
      language: language(),
    });
    const session = response.data?.createInterviewSession;
    if (!session) {
      setHasError(true);
      return;
    }
    navigate(paths.liveBriefing(session.id));
  };

  return {
    form,
    ...resumePicker,
    language,
    languageLabel,
    setLanguage,
    errorMessage,
    prepare,
    goBack,
  };
}
