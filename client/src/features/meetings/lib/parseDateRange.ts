import { date } from '@/shared/lib/time';
import type { DateRange } from '@/shared/ui/date-range-picker';

const isDateKey = (value?: string): value is string =>
  !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && date(value).isValid();

export const parseDateRange = (
  from?: string,
  to?: string,
): DateRange | null => {
  if (!isDateKey(from) || !isDateKey(to)) return null;
  return from <= to ? { from, to } : { from: to, to: from };
};
