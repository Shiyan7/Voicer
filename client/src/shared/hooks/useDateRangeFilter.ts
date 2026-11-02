import { parseDateRange } from '@/shared/lib/date-range';
import type { DateRange } from '@/shared/ui/date-range-picker';

import type { FilterParams } from './useFilterParams';

const FROM_PARAM = 'from';
const TO_PARAM = 'to';
const paramKeys = [FROM_PARAM, TO_PARAM];

export const useDateRangeFilter = (params: FilterParams) => {
  const dateRange = () =>
    parseDateRange(params.read(FROM_PARAM), params.read(TO_PARAM));

  const hasDateFilter = () => dateRange() !== null;

  const setDateRange = (range: DateRange | null) =>
    params.update({ [FROM_PARAM]: range?.from, [TO_PARAM]: range?.to });

  return { dateRange, hasDateFilter, setDateRange, paramKeys };
};
