import { SearchMatchKind } from '@schema';

import type { IconName } from '@/shared/ui/icon';

const MATCH_ICONS: Record<SearchMatchKind, IconName> = {
  [SearchMatchKind.Transcript]: 'common:document-text',
  [SearchMatchKind.KeyPoint]: 'common:sparkles',
  [SearchMatchKind.ActionItem]: 'navigation:check',
  [SearchMatchKind.Source]: 'common:audio',
};

export const getMatchIcon = (kind: SearchMatchKind) => MATCH_ICONS[kind];
