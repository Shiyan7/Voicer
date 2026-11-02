import {
  InterviewLanguage,
  InterviewMode,
  type InterviewRecommendationsOutput,
} from '@schema';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { storage } from '@/shared/storage';
import type { Tab } from '@/shared/ui/tabs';

import { createInterviewSessionMutation } from '../api/createInterviewSessionMutation';
import {
  LANGUAGE_OPTIONS,
  PREP_MODE_STORAGE_KEY,
  PREP_SECTIONS,
} from '../config/interviewPrepConfig';
import { getModeOptions } from '../lib/getModeOptions';
import { PrepSectionKey } from '../types/PrepSectionKey';

export function useInterviewPrep() {
  const navigate = useNavigate();
  const [resume, setResume] = createSignal<File>();
  const [vacancy, setVacancy] = createSignal('');
  const [language, setLanguage] = createSignal(InterviewLanguage.Ru);
  const [mode, setMode] = createSignal<InterviewMode>();
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
    !isPreparing() && !!mode() && hasResume() && vacancy().trim().length > 0;

  const languageLabel = () =>
    LANGUAGE_OPTIONS.find((option) => option.value === language())?.label ?? '';

  const prepareLabel = () => {
    if (mode() === InterviewMode.Mock) return i18n.t('live.prep.start_mock');
    if (mode() === InterviewMode.Real) return i18n.t('live.prep.prepare_real');
    return i18n.t('live.prep.prepare');
  };

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

  const selectMode = (value: InterviewMode) => {
    reset();
    setMode(value);
    void storage.setItem(PREP_MODE_STORAGE_KEY, value);
  };

  const restoreMode = async () => {
    const saved = await storage.getItem(PREP_MODE_STORAGE_KEY);
    if (Object.values(InterviewMode).includes(saved as InterviewMode)) {
      setMode(saved as InterviewMode);
    }
  };

  const start = () => {
    const id = sessionId();
    if (id) navigate(paths.liveSession(id));
  };

  const goBack = () => navigate(paths.live);

  const prepare = async () => {
    const file = resume();
    const selectedMode = mode();
    if (!file || !selectedMode) return;
    reset();
    const response = await createSession({
      resume: file,
      vacancy: vacancy().trim(),
      language: language(),
      mode: selectedMode,
    });
    const session = response.data?.createInterviewSession;
    if (!session) {
      setHasError(true);
      return;
    }
    if (selectedMode === InterviewMode.Mock) {
      navigate(paths.liveSession(session.id));
      return;
    }
    setSessionId(session.id);
    setRecommendations(session.recommendations);
  };

  onMount(() => void restoreMode());

  const modeOptions = getModeOptions;

  return {
    resumeLabel,
    hasResume,
    vacancy,
    language,
    languageLabel,
    setLanguage,
    modeOptions,
    mode,
    selectMode,
    prepareLabel,
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
