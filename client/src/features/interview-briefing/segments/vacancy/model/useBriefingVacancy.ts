import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';

export function useBriefingVacancy() {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isLong, setIsLong] = createSignal(false);

  const measure = (element: HTMLElement) =>
    requestAnimationFrame(() =>
      setIsLong(element.scrollHeight > element.clientHeight),
    );

  const toggle = () => setIsExpanded((current) => !current);

  const toggleLabel = () =>
    isExpanded()
      ? i18n.t('live.prep.vacancy_collapse')
      : i18n.t('live.prep.vacancy_expand');

  const isFaded = () => isLong() && !isExpanded();

  return { isExpanded, isLong, isFaded, measure, toggle, toggleLabel };
}
