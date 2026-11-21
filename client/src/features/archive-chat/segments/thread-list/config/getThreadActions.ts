import { i18n } from '@/shared/i18n';
import type { DropdownOption } from '@/shared/ui/dropdown';

import { ThreadAction } from '../types/ThreadAction';

const getPinAction = (isPinned: boolean): DropdownOption<ThreadAction> =>
  isPinned
    ? { value: 'unpin', label: i18n.t('chat.unpin'), icon: 'common:pin-off' }
    : { value: 'pin', label: i18n.t('chat.pin'), icon: 'common:pin' };

export const getThreadActions = (
  isPinned: boolean,
): DropdownOption<ThreadAction>[] => [
  getPinAction(isPinned),
  { value: 'rename', label: i18n.t('chat.rename'), icon: 'common:pencil' },
  {
    value: 'delete',
    label: i18n.t('chat.delete'),
    icon: 'common:trash',
    isDanger: true,
  },
];
