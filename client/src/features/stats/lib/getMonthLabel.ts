import { i18n } from '@/shared/i18n';

export const getMonthLabel = (month: number) =>
  new Intl.DateTimeFormat(i18n.locale(), {
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2024, month - 1, 1)));
