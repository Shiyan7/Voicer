import { createFormStore, valiForm } from '@modular-forms/solid';
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
import { createPrepSchema, PrepForm } from '../config/createPrepSchema';
import {
  LANGUAGE_OPTIONS,
  PREP_MODE_STORAGE_KEY,
  PREP_SECTIONS,
} from '../config/interviewPrepConfig';
import { getModeOptions } from '../lib/getModeOptions';
import { PrepSectionKey } from '../types/PrepSectionKey';

export function useInterviewPrep() {
  const navigate = useNavigate();
  const form = createFormStore<PrepForm>({
    validate: (values) => valiForm(createPrepSchema())(values),
    validateOn: 'submit',
    revalidateOn: 'input',
  });
  const [language, setLanguage] = createSignal(InterviewLanguage.Ru);
  const [mode, setMode] = createSignal(InterviewMode.Mock);
  const [recommendations, setRecommendations] =
    createSignal<InterviewRecommendationsOutput>();
  const [activeSection, setActiveSection] =
    createSignal<PrepSectionKey>('questions');
  const [sessionId, setSessionId] = createSignal<string>();
  const [hasError, setHasError] = createSignal(false);
  const [createState, createSession] = createInterviewSessionMutation();

  const isPreparing = () => createState.fetching;

  const languageLabel = () =>
    LANGUAGE_OPTIONS.find((option) => option.value === language())?.label ?? '';

  const prepareLabel = () => {
    if (isPreparing()) return i18n.t('live.prep.preparing');
    return mode() === InterviewMode.Mock
      ? i18n.t('live.prep.start_mock')
      : i18n.t('live.prep.prepare_real');
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

  const prepare = async (values: PrepForm) => {
    const selectedMode = mode();
    reset();
    const response = await createSession({
      resume: values.resume,
      vacancy: values.vacancy,
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
    form,
    language,
    languageLabel,
    setLanguage,
    modeOptions,
    mode,
    selectMode,
    prepareLabel,
    isPreparing,
    sectionTabs,
    activeSection,
    activeItems,
    setActiveSection,
    isReady,
    errorMessage,
    prepare,
    start,
    goBack,
  };
}
