import { i18n } from '@/shared/i18n';
import type { DropdownOption } from '@/shared/ui/dropdown';

import { ThreadAction } from '../types/ThreadAction';

export const getThreadActions = (): DropdownOption<ThreadAction>[] => [
  { value: 'rename', label: i18n.t('chat.rename'), icon: 'common:pencil' },
  {
    value: 'delete',
    label: i18n.t('chat.delete'),
    icon: 'common:trash',
    isDanger: true,
  },
];
