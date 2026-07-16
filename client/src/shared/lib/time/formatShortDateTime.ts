import { i18n } from '@/shared/i18n';

export function formatShortDateTime(date: Date | string | number) {
  return new Intl.DateTimeFormat(i18n.locale(), {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
