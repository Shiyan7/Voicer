import { getExportTextOption, getShowInFinderOption } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

import { MoreAction } from '../types/MoreAction';

const getFavoriteOption = (
  isFavorite: boolean,
): DropdownOption<MoreAction> => ({
  value: 'favorite',
  label: isFavorite
    ? i18n.t('meetings.remove_favorite')
    : i18n.t('meetings.add_favorite'),
  icon: isFavorite ? 'navigation:bookmark-solid' : 'navigation:bookmark',
});

export const getMoreActionOptions = (
  isFavorite: boolean,
  hasAudio: boolean,
): DropdownOption<MoreAction>[] => [
  getFavoriteOption(isFavorite),
  ...(hasAudio ? [getShowInFinderOption()] : []),
  getExportTextOption(),
  {
    value: 'delete',
    label: i18n.t('meetings.delete_meeting'),
    icon: 'common:trash',
    isDanger: true,
  },
];
