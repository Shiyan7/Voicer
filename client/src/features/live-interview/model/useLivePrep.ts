import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { createInterviewSessionMutation } from '../api/createInterviewSessionMutation';
import { toPrepResult } from '../lib/toPrepResult';
import { LivePrepResult } from '../types/LivePrepResult';

export function useLivePrep() {
  const [resume, setResume] = createSignal<File>();
  const [vacancy, setVacancy] = createSignal('');
  const [result, setResult] = createSignal<LivePrepResult>();
  const [sessionId, setSessionId] = createSignal<string>();
  const [hasError, setHasError] = createSignal(false);
  const [createState, createSession] = createInterviewSessionMutation();

  const resumeLabel = () =>
    resume()?.name || i18n.t('live.prep.resume_placeholder');

  const hasResume = () => !!resume();

  const isPreparing = () => createState.fetching;

  const canPrepare = () =>
    !isPreparing() && hasResume() && vacancy().trim().length > 0;

  const sections = () =>
    (result()?.sections ?? []).map((section) => ({
      title: i18n.t(`live.prep.sections.${section.titleKey}`),
      items: section.items,
    }));

  const isReady = () => !!result() && !!sessionId();

  const errorMessage = () => (hasError() ? i18n.t('live.prep.error') : '');

  const onResumeSelected = (event: Event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    setResume(file);
  };

  const onVacancyInput = (value: string) => setVacancy(value);

  const prepare = async () => {
    const file = resume();
    if (!file) return;
    setHasError(false);
    const response = await createSession({
      resume: file,
      vacancy: vacancy().trim(),
    });
    const session = response.data?.createInterviewSession;
    if (!session) {
      setHasError(true);
      return;
    }
    setSessionId(session.id);
    setResult(toPrepResult(session.recommendations));
  };

  return {
    resumeLabel,
    hasResume,
    vacancy,
    isPreparing,
    canPrepare,
    sections,
    isReady,
    errorMessage,
    sessionId,
    onResumeSelected,
    onVacancyInput,
    prepare,
  };
}
