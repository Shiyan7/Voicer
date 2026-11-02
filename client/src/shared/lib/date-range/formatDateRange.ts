import { date, formatDayDate } from '@/shared/lib/time';
import type { DateRange } from '@/shared/ui/date-range-picker';

const formatDay = (key: string) =>
  formatDayDate(key, !date(key).isSame(date(), 'year'));

export const formatDateRange = (range: DateRange | null) => {
  if (!range) return '';
  if (range.from === range.to) return formatDay(range.from);
  return `${formatDay(range.from)} – ${formatDay(range.to)}`;
};
