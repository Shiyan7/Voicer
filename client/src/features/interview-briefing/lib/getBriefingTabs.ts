import { i18n } from '@/shared/i18n';
import type { Tab } from '@/shared/ui/tabs';

import { BriefingSectionKey } from '../types/BriefingSectionKey';

export const getBriefingTabs = (): Tab<BriefingSectionKey>[] => [
  { label: i18n.t('live.prep.sections.topics'), value: 'topics' },
  { label: i18n.t('live.prep.sections.questions'), value: 'likelyQuestions' },
  { label: i18n.t('live.prep.sections.emphasis'), value: 'emphasize' },
];
