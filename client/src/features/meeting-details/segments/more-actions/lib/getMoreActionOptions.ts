import { getExportTextOption, getShowInFinderOption } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

import { MoreAction } from '../types/MoreAction';

export const getMoreActionOptions = (
  isFavorite: boolean,
  hasAudio: boolean,
): DropdownOption<MoreAction>[] => [
  ...(hasAudio ? [getShowInFinderOption()] : []),
  getExportTextOption(),
  {
    value: 'favorite',
    label: isFavorite
      ? i18n.t('meetings.remove_favorite')
      : i18n.t('meetings.add_favorite'),
    icon: isFavorite ? 'navigation:bookmark-solid' : 'navigation:bookmark',
  },
  {
    value: 'find',
    label: i18n.t('meetings.find.title'),
    icon: 'common:search',
  },
  {
    value: 'delete',
    label: i18n.t('meetings.delete_meeting'),
    icon: 'common:trash',
    isDanger: true,
  },
];
