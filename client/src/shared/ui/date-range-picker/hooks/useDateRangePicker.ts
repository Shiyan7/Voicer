import { createSignal } from 'solid-js';

import { useDropdown } from '@/shared/ui/dropdown';

import { buildMonthDays, getMonthStart } from '../lib/buildMonthDays';
import { getWeekdayLabels } from '../lib/getWeekdayLabels';
import { sortRange } from '../lib/sortRange';
import { CalendarDay, DateRange } from '../types';

interface DateRangePickerParams {
  value: () => DateRange | null;
  onChange: (range: DateRange | null) => void;
}

export const useDateRangePicker = (params: DateRangePickerParams) => {
  const dropdown = useDropdown();
  const [month, setMonth] = createSignal(getMonthStart());
  const [anchor, setAnchor] = createSignal<string | null>(null);
  const [hovered, setHovered] = createSignal<string | null>(null);

  const days = () => buildMonthDays(month());

  const monthTitle = () => month().format('MMMM YYYY');

  const isCurrentMonth = () => month().isSame(getMonthStart(), 'month');

  const isSelecting = () => anchor() !== null;

  const visibleRange = (): DateRange | null => {
    const start = anchor();
    if (!start) return params.value();
    return sortRange(start, hovered() ?? start);
  };

  const isEdge = (day: CalendarDay) => {
    const range = visibleRange();
    return day.key === range?.from || day.key === range?.to;
  };

  const isInRange = (day: CalendarDay) => {
    const range = visibleRange();
    return !!range && day.key > range.from && day.key < range.to;
  };

  const resetDraft = () => {
    setAnchor(null);
    setHovered(null);
  };

  const toggle = () => {
    resetDraft();
    setMonth(getMonthStart(params.value()?.to));
    dropdown.toggle();
  };

  const apply = (range: DateRange | null) => {
    resetDraft();
    params.onChange(range);
    dropdown.close();
  };

  const selectDay = (key: string) => {
    const start = anchor();
    if (!start) {
      setAnchor(key);
      return;
    }
    apply(sortRange(start, key));
  };

  const hoverDay = (key: string | null) => {
    if (isSelecting()) setHovered(key);
  };

  return {
    opened: dropdown.opened,
    setRootRef: dropdown.setRootRef,
    weekdays: getWeekdayLabels,
    days,
    monthTitle,
    isCurrentMonth,
    isSelecting,
    isEdge,
    isInRange,
    toggle,
    apply,
    clear: () => apply(null),
    selectDay,
    hoverDay,
    prevMonth: () => setMonth((value) => value.subtract(1, 'month')),
    nextMonth: () => setMonth((value) => value.add(1, 'month')),
  };
};
