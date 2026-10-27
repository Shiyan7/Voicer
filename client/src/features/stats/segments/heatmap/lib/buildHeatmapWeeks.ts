import type { StatsCalendarDayOutput } from '@schema';

import { DAY_MS } from '../../../config/statsConfig';
import { HeatCell } from '../types/HeatCell';
import { getHeatLevel } from './getHeatLevel';

const toDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

const getWeekStart = (ms: number) =>
  ms - ((new Date(ms).getUTCDay() + 6) % 7) * DAY_MS;

export const buildHeatmapWeeks = (
  year: number,
  days: StatsCalendarDayOutput[],
  thresholds: number[],
): HeatCell[][] => {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const yearEnd = Date.UTC(year, 11, 31);
  const weeks: HeatCell[][] = [];

  for (
    let weekStart = getWeekStart(Date.UTC(year, 0, 1));
    weekStart <= yearEnd;
    weekStart += 7 * DAY_MS
  ) {
    weeks.push(
      Array.from({ length: 7 }, (_, weekday) => {
        const ms = weekStart + weekday * DAY_MS;
        const date = toDate(ms);
        const day = byDate.get(date);
        const count = day?.count ?? 0;
        const durationSec = day?.durationSec ?? 0;

        return {
          date,
          count,
          durationSec,
          level: getHeatLevel(count, durationSec, thresholds),
          isOutside: new Date(ms).getUTCFullYear() !== year,
        };
      }),
    );
  }

  return weeks;
};
