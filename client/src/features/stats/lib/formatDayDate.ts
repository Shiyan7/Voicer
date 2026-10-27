import { i18n } from '@/shared/i18n';

export const formatDayDate = (date: string, withYear = false) =>
  new Intl.DateTimeFormat(i18n.locale(), {
    day: 'numeric',
    month: 'long',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
