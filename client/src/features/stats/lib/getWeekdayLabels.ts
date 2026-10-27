import { i18n } from '@/shared/i18n';

import { DAY_MS, MONDAY_UTC } from '../config/statsConfig';

export const getWeekdayLabels = () => {
  const format = new Intl.DateTimeFormat(i18n.locale(), {
    weekday: 'short',
    timeZone: 'UTC',
  });
  return Array.from({ length: 7 }, (_, index) =>
    format.format(new Date(MONDAY_UTC + index * DAY_MS)),
  );
};
