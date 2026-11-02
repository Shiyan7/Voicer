import { InterviewLanguage } from '@schema';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';

import { createInterviewSessionMutation } from '../api/createInterviewSessionMutation';
import { LANGUAGE_OPTIONS } from '../config/interviewPrepConfig';
import { useSavedResumes } from './useSavedResumes';

export function useInterviewPrep() {
  const navigate = useNavigate();
  const savedResumes = useSavedResumes();
  const [resume, setResume] = createSignal<File>();
  const [vacancy, setVacancy] = createSignal('');
  const [language, setLanguage] = createSignal(InterviewLanguage.Ru);
  const [hasError, setHasError] = createSignal(false);
  const [createState, createSession] = createInterviewSessionMutation();

  const resumeLabel = () =>
    resume()?.name ??
    savedResumes.selectedLabel() ??
    i18n.t('live.prep.resume_placeholder');

  const hasResume = () => !!resume() || !!savedResumes.selectedId();

  const languageLabel = () =>
    LANGUAGE_OPTIONS.find((option) => option.value === language())?.label ?? '';

  const isPreparing = () => createState.fetching;

  const canPrepare = () =>
    !isPreparing() && hasResume() && vacancy().trim().length > 0;

  const errorMessage = () => (hasError() ? i18n.t('live.prep.error') : '');

  const onResumeSelected = (file: File) => {
    savedResumes.setSelectedId(undefined);
    setResume(file);
  };

  const selectResume = (id: string) => {
    setResume(undefined);
    savedResumes.setSelectedId(id);
  };

  const onVacancyInput = (value: string) => setVacancy(value);

  const goBack = () => navigate(paths.live);

  const prepare = async () => {
    setHasError(false);
    const response = await createSession({
      resume: resume(),
      resumeSessionId: savedResumes.selectedId(),
      vacancy: vacancy().trim(),
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
    resumeLabel,
    hasResume,
    savedResumes,
    selectResume,
    vacancy,
    language,
    languageLabel,
    setLanguage,
    canPrepare,
    errorMessage,
    onResumeSelected,
    onVacancyInput,
    prepare,
    goBack,
  };
}
