import { createSignal } from 'solid-js';

import { getBriefingTabs } from '../lib/getBriefingTabs';
import { BriefingSectionKey } from '../types/BriefingSectionKey';
import { BriefingSectionsDeps } from '../types/BriefingSectionsDeps';

export function useBriefingSections(deps: BriefingSectionsDeps) {
  const [activeSection, setActiveSection] =
    createSignal<BriefingSectionKey>('likelyQuestions');

  const tabs = () => getBriefingTabs();

  const items = () => deps.recommendations?.[activeSection()] ?? [];

  return { activeSection, setActiveSection, tabs, items };
}
