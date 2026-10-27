import { i18n } from '@/shared/i18n';

const MONDAY_UTC = Date.UTC(2024, 0, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

export const getWeekdayLabels = () => {
  const format = new Intl.DateTimeFormat(i18n.locale(), {
    weekday: 'short',
    timeZone: 'UTC',
  });
  return Array.from({ length: 7 }, (_, index) =>
    format.format(new Date(MONDAY_UTC + index * DAY_MS)),
  );
};
