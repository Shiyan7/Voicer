import { getExportTextOption, getShowInFinderOption } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

import { ReviewAction } from '../types/ReviewAction';

export const getReviewActionOptions = (
  hasRecording: boolean,
): DropdownOption<ReviewAction>[] => [
  ...(hasRecording ? [getShowInFinderOption(), getExportTextOption()] : []),
  {
    value: 'delete',
    label: i18n.t('live.delete.menu'),
    icon: 'common:trash',
    isDanger: true,
  },
];
