import type { StatsCalendarDayOutput } from '@schema';

import { date, toDateKey } from '@/shared/lib/time';

import { HeatCell } from '../types/HeatCell';
import { getHeatLevel } from './getHeatLevel';

export const buildHeatmapWeeks = (
  year: number,
  days: StatsCalendarDayOutput[],
  thresholds: number[],
): HeatCell[][] => {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const yearStart = date(`${year}-01-01`);
  const yearEnd = yearStart.endOf('year');
  const weeks: HeatCell[][] = [];

  for (
    let weekStart = yearStart.startOf('isoWeek');
    !weekStart.isAfter(yearEnd);
    weekStart = weekStart.add(1, 'week')
  ) {
    weeks.push(
      Array.from({ length: 7 }, (_, weekday) => {
        const day = weekStart.add(weekday, 'day');
        const key = toDateKey(day);
        const stats = byDate.get(key);
        const count = stats?.count ?? 0;
        const durationSec = stats?.durationSec ?? 0;

        return {
          date: key,
          count,
          durationSec,
          level: getHeatLevel(count, durationSec, thresholds),
          isOutside: day.year() !== year,
        };
      }),
    );
  }

  return weeks;
};
