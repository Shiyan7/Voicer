import { date } from '@/shared/lib/time';
import type { DateRange } from '@/shared/ui/date-range-picker';

export const toDateRangeInput = (range: DateRange | null) => ({
  from: range ? date(range.from).startOf('day').toISOString() : null,
  to: range ? date(range.to).add(1, 'day').startOf('day').toISOString() : null,
});
