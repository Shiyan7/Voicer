import { i18n } from '@/shared/i18n';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

export function formatRelativeTime(date: Date | string | number) {
  const diffSec = (new Date(date).getTime() - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat(i18n.locale(), {
    numeric: 'auto',
  });

  for (const [unit, size] of UNITS) {
    if (Math.abs(diffSec) >= size) {
      return format.format(Math.round(diffSec / size), unit);
    }
  }

  return format.format(0, 'minute');
}
