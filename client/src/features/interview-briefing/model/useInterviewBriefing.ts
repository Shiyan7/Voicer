import { useNavigate, useParams } from '@solidjs/router';
import { createSignal, onCleanup } from 'solid-js';

import { useInterviewPreparation } from '@/entities/interview-session';
import { i18n } from '@/shared/i18n';
import { MODALS, showModal } from '@/shared/lib/modal';
import { paths } from '@/shared/router';
import type { Tab } from '@/shared/ui/tabs';

import {
  BRIEFING_SECTIONS,
  TITLE_DOTS_INTERVAL_MS,
  TITLE_DOTS_MAX,
} from '../config/briefingConfig';
import { BriefingSectionKey } from '../types/BriefingSectionKey';

export function useInterviewBriefing() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = () => params.id;
  const preparation = useInterviewPreparation(sessionId);
  const [activeSection, setActiveSection] =
    createSignal<BriefingSectionKey>('questions');

  const [dotCount, setDotCount] = createSignal(0);
  const dotsTimer = setInterval(
    () => setDotCount((count) => (count + 1) % (TITLE_DOTS_MAX + 1)),
    TITLE_DOTS_INTERVAL_MS,
  );

  onCleanup(() => clearInterval(dotsTimer));

  const title = () => {
    const base = i18n.t('live.prep.title');
    if (preparation.isPreparing()) return base + '.'.repeat(dotCount());
    return preparation.session()?.title ?? base;
  };

  const resumeName = () => preparation.session()?.resumeFileName;

  const [isVacancyExpanded, setIsVacancyExpanded] = createSignal(false);
  const [isVacancyLong, setIsVacancyLong] = createSignal(false);

  const measureVacancy = (element: HTMLElement) =>
    requestAnimationFrame(() =>
      setIsVacancyLong(element.scrollHeight > element.clientHeight),
    );

  const toggleVacancy = () => setIsVacancyExpanded((current) => !current);

  const vacancyToggleLabel = () =>
    isVacancyExpanded()
      ? i18n.t('live.prep.vacancy_collapse')
      : i18n.t('live.prep.vacancy_expand');

  const isVacancyFaded = () => isVacancyLong() && !isVacancyExpanded();

  const vacancyText = () => preparation.session()?.vacancyText ?? '';

  const resumeUrl = () => preparation.session()?.resumeUrl;

  const openResume = () => showModal(MODALS.INTERVIEW_RESUME);

  const sectionTabs = (): Tab<BriefingSectionKey>[] =>
    (Object.keys(BRIEFING_SECTIONS) as BriefingSectionKey[]).map((key) => ({
      label: i18n.t(`live.prep.sections.${key}`),
      value: key,
    }));

  const activeItems = () =>
    preparation.recommendations()?.[BRIEFING_SECTIONS[activeSection()]] ?? [];

  const start = () => navigate(paths.liveSession(sessionId()));

  const goBack = () => navigate(paths.live);

  return {
    title,
    resumeName,
    vacancyText,
    isVacancyExpanded,
    isVacancyLong,
    isVacancyFaded,
    measureVacancy,
    toggleVacancy,
    vacancyToggleLabel,
    resumeUrl,
    openResume,
    isPreparing: preparation.isPreparing,
    isReady: preparation.isReady,
    isFailed: preparation.isFailed,
    retry: preparation.retry,
    sectionTabs,
    activeSection,
    setActiveSection,
    activeItems,
    start,
    goBack,
  };
}
