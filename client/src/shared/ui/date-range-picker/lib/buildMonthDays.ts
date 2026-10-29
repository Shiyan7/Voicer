import type { Dayjs } from 'dayjs';

import { date, toDateKey } from '@/shared/lib/time';

import { DAYS_IN_GRID } from '../config/DAYS_IN_GRID';
import { CalendarDay } from '../types';

export const buildMonthDays = (month: Dayjs): CalendarDay[] => {
  const today = toDateKey();
  const gridStart = month.startOf('month').isoWeekday(1);

  return Array.from({ length: DAYS_IN_GRID }, (_, index) => {
    const day = gridStart.add(index, 'day');
    const key = toDateKey(day);

    return {
      key,
      label: String(day.date()),
      isOutside: !day.isSame(month, 'month'),
      isToday: key === today,
      isFuture: key > today,
    };
  });
};

export const getMonthStart = (key?: string) => date(key).startOf('month');
