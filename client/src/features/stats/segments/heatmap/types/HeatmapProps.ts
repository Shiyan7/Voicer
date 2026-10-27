import type { StatsCalendarDayOutput } from '@schema';

export interface HeatmapProps {
  year: number;
  years: number[];
  days: StatsCalendarDayOutput[];
  selectedDate: string | null;
  isLoading: boolean;
  onYearChange: (year: number) => void;
  onSelect: (date: string) => void;
}
