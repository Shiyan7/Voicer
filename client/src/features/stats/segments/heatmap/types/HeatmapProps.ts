import type { StatsDayOutput } from '@schema';

export interface HeatmapProps {
  year: number;
  years: number[];
  days: StatsDayOutput[];
  selectedDate: string | null;
  isLoading: boolean;
  onYearChange: (year: number) => void;
  onSelect: (date: string) => void;
}
