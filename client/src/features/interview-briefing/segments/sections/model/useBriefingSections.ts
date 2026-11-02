import { createSignal } from 'solid-js';

import { BriefingSectionKey } from '../types/BriefingSectionKey';
import { BriefingSectionsProps } from '../types/BriefingSectionsProps';

export function useBriefingSections(props: BriefingSectionsProps) {
  const [activeSection, setActiveSection] =
    createSignal<BriefingSectionKey>('likelyQuestions');

  const activeItems = () => props.recommendations[activeSection()];

  return { activeSection, setActiveSection, activeItems };
}
