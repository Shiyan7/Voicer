import { formatShortDateTime } from './date';

export const withDateSuffix = (
  label: string,
  date?: Date | string | number | null,
): string => (date ? `${label}, ${formatShortDateTime(date)}` : label);
