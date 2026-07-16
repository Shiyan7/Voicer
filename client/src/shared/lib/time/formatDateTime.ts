import { i18n } from '@/shared/i18n';

export function formatDateTime(date: Date | string | number) {
  return new Intl.DateTimeFormat(i18n.locale(), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
