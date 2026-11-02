import {
  createFormStore,
  getValue,
  reset,
  valiForm,
} from '@modular-forms/solid';
import { InterviewLanguage, InterviewMode } from '@schema';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';

import { createInterviewSessionMutation } from '../api/createInterviewSessionMutation';
import { interviewResumesQuery } from '../api/interviewResumesQuery';
import { createPrepSchema, PrepForm } from '../config/createPrepSchema';
import { LANGUAGE_OPTIONS } from '../config/interviewPrepConfig';
import { getModeOptions } from '../lib/getModeOptions';
import { PrepResumeOption } from '../types/PrepResumeOption';

export function useInterviewPrep() {
  const navigate = useNavigate();
  const [resumesState] = interviewResumesQuery();
  const [pickedResumeId, setPickedResumeId] = createSignal<string>();
  const form = createFormStore<PrepForm>({
    validate: (values) =>
      valiForm(createPrepSchema(!!pickedResumeId()))(values),
    validateOn: 'submit',
    revalidateOn: 'input',
  });
  const [language, setLanguage] = createSignal(InterviewLanguage.Ru);
  const [mode, setMode] = createSignal(InterviewMode.Mock);
  const [hasError, setHasError] = createSignal(false);
  const [createState, createSession] = createInterviewSessionMutation();

  const resumeOptions = (): PrepResumeOption[] =>
    (resumesState.data?.interviewResumes ?? []).map((resume) => ({
      id: resume.sessionId,
      label: resume.fileName ?? '',
    }));

  const selectedResumeId = () =>
    getValue(form, 'resume') ? undefined : pickedResumeId();

  const selectedResumeLabel = () =>
    resumeOptions().find((option) => option.id === selectedResumeId())?.label;

  const selectResume = (id: string) => {
    reset(form, 'resume');
    setPickedResumeId(id);
  };

  const isSubmitting = () => createState.fetching;

  const languageLabel = () =>
    LANGUAGE_OPTIONS.find((option) => option.value === language())?.label ?? '';

  const submitLabel = () =>
    mode() === InterviewMode.Mock
      ? i18n.t('live.prep.start_mock')
      : i18n.t('live.prep.prepare_real');

  const errorMessage = () => (hasError() ? i18n.t('live.prep.error') : '');

  const goBack = () => navigate(paths.live);

  const submit = async (values: PrepForm) => {
    setHasError(false);
    const response = await createSession({
      resume: values.resume,
      resumeSessionId: selectedResumeId(),
      vacancy: values.vacancy,
      language: language(),
      mode: mode(),
    });
    const session = response.data?.createInterviewSession;
    if (!session) {
      setHasError(true);
      return;
    }
    navigate(
      mode() === InterviewMode.Mock
        ? paths.liveSession(session.id)
        : paths.liveBriefing(session.id),
    );
  };

  const modeOptions = getModeOptions;

  return {
    form,
    language,
    languageLabel,
    setLanguage,
    modeOptions,
    mode,
    setMode,
    submitLabel,
    resumeOptions,
    selectedResumeId,
    selectedResumeLabel,
    selectResume,
    isSubmitting,
    errorMessage,
    submit,
    goBack,
  };
}
