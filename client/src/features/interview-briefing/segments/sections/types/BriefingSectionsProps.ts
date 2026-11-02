import type { Tab } from '@/shared/ui/tabs';

import { BriefingSectionKey } from '../../../types/BriefingSectionKey';

export interface BriefingSectionsProps {
  tabs: Tab<BriefingSectionKey>[];
  activeSection: BriefingSectionKey;
  items: string[];
  onSelectSection: (key: BriefingSectionKey) => void;
}
