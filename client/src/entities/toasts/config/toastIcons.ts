import { IconName } from '@/shared/ui/icon';

import { ToastType } from '../model/useToasts';

export const TOAST_ICONS: Record<ToastType, IconName> = {
  success: 'common:check',
  error: 'common:cross',
  warning: 'common:exclamation',
  info: 'common:exclamation',
};
