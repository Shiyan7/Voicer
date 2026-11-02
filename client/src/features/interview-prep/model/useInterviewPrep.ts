import {
  InterviewLanguage,
  type InterviewRecommendationsOutput,
} from '@schema';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import type { Tab } from '@/shared/ui/tabs';

import { createInterviewSessionMutation } from '../api/createInterviewSessionMutation';
import { PREP_SECTIONS } from '../config/interviewPrepConfig';
import { PrepSectionKey } from '../types/PrepSectionKey';

export function useInterviewPrep() {
  const navigate = useNavigate();
  const [resume, setResume] = createSignal<File>();
  const [vacancy, setVacancy] = createSignal('');
  const [language, setLanguage] = createSignal(InterviewLanguage.Ru);
  const [recommendations, setRecommendations] =
    createSignal<InterviewRecommendationsOutput>();
  const [activeSection, setActiveSection] =
    createSignal<PrepSectionKey>('questions');
  const [sessionId, setSessionId] = createSignal<string>();
  const [hasError, setHasError] = createSignal(false);
  const [createState, createSession] = createInterviewSessionMutation();

  const resumeLabel = () =>
    resume()?.name || i18n.t('live.prep.resume_placeholder');

  const hasResume = () => !!resume();

  const isPreparing = () => createState.fetching;

  const canPrepare = () =>
    !isPreparing() && hasResume() && vacancy().trim().length > 0;

  const sectionTabs = (): Tab<PrepSectionKey>[] =>
    recommendations()
      ? (Object.keys(PREP_SECTIONS) as PrepSectionKey[]).map((key) => ({
          label: i18n.t(`live.prep.sections.${key}`),
          value: key,
        }))
      : [];

  const activeItems = () =>
    recommendations()?.[PREP_SECTIONS[activeSection()]] ?? [];

  const isReady = () => !!sessionId();

  const errorMessage = () => (hasError() ? i18n.t('live.prep.error') : '');

  const onResumeSelected = (file: File | undefined) => setResume(file);

  const onVacancyInput = (value: string) => setVacancy(value);

  const reset = () => {
    setSessionId(undefined);
    setRecommendations(undefined);
    setActiveSection('questions');
    setHasError(false);
  };

  const start = () => {
    const id = sessionId();
    if (id) navigate(paths.liveSession(id));
  };

  const goBack = () => navigate(paths.live);

  const prepare = async () => {
    const file = resume();
    if (!file) return;
    reset();
    const response = await createSession({
      resume: file,
      vacancy: vacancy().trim(),
      language: language(),
    });
    const session = response.data?.createInterviewSession;
    if (!session) {
      setHasError(true);
      return;
    }
    setSessionId(session.id);
    setRecommendations(session.recommendations);
  };

  return {
    resumeLabel,
    hasResume,
    vacancy,
    language,
    setLanguage,
    isPreparing,
    canPrepare,
    sectionTabs,
    activeSection,
    activeItems,
    setActiveSection,
    isReady,
    errorMessage,
    onResumeSelected,
    onVacancyInput,
    prepare,
    start,
    goBack,
  };
}
