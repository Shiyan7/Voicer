import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';

export function useBriefingVacancy() {
  const [isVacancyExpanded, setIsExpanded] = createSignal(false);
  const [isVacancyLong, setIsLong] = createSignal(false);

  const measureVacancy = (element: HTMLElement) =>
    requestAnimationFrame(() =>
      setIsLong(element.scrollHeight > element.clientHeight),
    );

  const toggleVacancy = () => setIsExpanded((current) => !current);

  const vacancyToggleLabel = () =>
    isVacancyExpanded()
      ? i18n.t('live.prep.vacancy_collapse')
      : i18n.t('live.prep.vacancy_expand');

  const isVacancyFaded = () => isVacancyLong() && !isVacancyExpanded();

  return {
    isVacancyExpanded,
    isVacancyLong,
    isVacancyFaded,
    measureVacancy,
    toggleVacancy,
    vacancyToggleLabel,
  };
}
