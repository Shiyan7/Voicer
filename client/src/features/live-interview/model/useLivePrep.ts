import type { InterviewRecommendationsOutput } from '@schema';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import type { Tab } from '@/shared/ui/tabs';

import { createInterviewSessionMutation } from '../api/createInterviewSessionMutation';
import { PREP_SECTIONS } from '../config/liveInterviewConfig';
import { LivePrepSectionKey } from '../types/LivePrepSectionKey';

export function useLivePrep() {
  const [resume, setResume] = createSignal<File>();
  const [vacancy, setVacancy] = createSignal('');
  const [recommendations, setRecommendations] =
    createSignal<InterviewRecommendationsOutput>();
  const [activeSection, setActiveSection] =
    createSignal<LivePrepSectionKey>('questions');
  const [sessionId, setSessionId] = createSignal<string>();
  const [hasError, setHasError] = createSignal(false);
  const [createState, createSession] = createInterviewSessionMutation();

  const resumeLabel = () =>
    resume()?.name || i18n.t('live.prep.resume_placeholder');

  const hasResume = () => !!resume();

  const isPreparing = () => createState.fetching;

  const canPrepare = () =>
    !isPreparing() && hasResume() && vacancy().trim().length > 0;

  const sectionTabs = (): Tab<LivePrepSectionKey>[] =>
    recommendations()
      ? (Object.keys(PREP_SECTIONS) as LivePrepSectionKey[]).map((key) => ({
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

  const fail = () => {
    setHasError(true);
  };

  const reset = () => {
    setSessionId(undefined);
    setRecommendations(undefined);
    setActiveSection('questions');
    setHasError(false);
  };

  const prepare = async () => {
    const file = resume();
    if (!file) return;
    reset();
    const response = await createSession({
      resume: file,
      vacancy: vacancy().trim(),
    });
    const session = response.data?.createInterviewSession;
    if (!session) {
      fail();
      return;
    }
    setSessionId(session.id);
    setRecommendations(session.recommendations);
  };

  return {
    resumeLabel,
    hasResume,
    vacancy,
    isPreparing,
    canPrepare,
    sectionTabs,
    activeSection,
    activeItems,
    setActiveSection,
    isReady,
    errorMessage,
    sessionId,
    onResumeSelected,
    onVacancyInput,
    prepare,
    fail,
    reset,
  };
}
