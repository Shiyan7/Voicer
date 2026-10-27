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

const getShowInFinderOption = (): DropdownOption<MoreAction> => ({
  value: 'show-in-finder',
  label: i18n.t('meetings.show_in_finder'),
  icon: 'common:folder',
});

export const getMoreActionOptions = (
  isFavorite: boolean,
  hasAudio: boolean,
): DropdownOption<MoreAction>[] => [
  getFavoriteOption(isFavorite),
  ...(hasAudio ? [getShowInFinderOption()] : []),
  {
    value: 'export-text',
    label: i18n.t('meetings.export_text'),
    icon: 'common:document-text',
  },
  {
    value: 'delete',
    label: i18n.t('meetings.delete_meeting'),
    icon: 'common:trash',
    isDanger: true,
  },
];
