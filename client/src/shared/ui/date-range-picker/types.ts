export interface DateRange {
  from: string;
  to: string;
}

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

export interface CalendarDay {
  key: string;
  label: string;
  isOutside: boolean;
  isToday: boolean;
  isFuture: boolean;
}
