import { getMonthLabel } from '../../../lib/getMonthLabel';
import { HeatCell } from '../types/HeatCell';
import { MonthLabel } from '../types/MonthLabel';

export const buildMonthLabels = (weeks: HeatCell[][]): MonthLabel[] =>
  weeks.flatMap((week, column) => {
    const first = week.find(
      (cell) => !cell.isOutside && cell.date.endsWith('-01'),
    );
    return first
      ? [{ column, label: getMonthLabel(Number(first.date.slice(5, 7))) }]
      : [];
  });
