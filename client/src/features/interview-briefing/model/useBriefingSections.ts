import type { InterviewRecommendationsOutput } from '@schema';
import { createSignal } from 'solid-js';

import { getBriefingTabs } from '../lib/getBriefingTabs';
import { BriefingSectionKey } from '../types/BriefingSectionKey';

export function useBriefingSections(
  recommendations: () => InterviewRecommendationsOutput | null | undefined,
) {
  const [activeSection, setActiveSection] =
    createSignal<BriefingSectionKey>('likelyQuestions');

  const sectionTabs = () => getBriefingTabs();

  const sectionItems = () => recommendations()?.[activeSection()] ?? [];

  return { activeSection, setActiveSection, sectionTabs, sectionItems };
}
