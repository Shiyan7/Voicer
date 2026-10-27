import { createSignal } from 'solid-js';

import { statsSummaryQuery } from '../api/statsSummaryQuery';
import { statsYearQuery } from '../api/statsYearQuery';
import { getTimeZone } from '../lib/getTimeZone';

export const useStats = () => {
  const timeZone = getTimeZone();

  const [year, setYear] = createSignal(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = createSignal<string | null>(null);

  const [summary] = statsSummaryQuery(() => ({ input: { timeZone } }));
  const [yearStats] = statsYearQuery(() => ({
    input: { year: year(), timeZone },
  }));

  const selectYear = (value: number) => {
    setYear(value);
    setSelectedDate(null);
  };

  const toggleDate = (date: string) =>
    setSelectedDate((current) => (current === date ? null : date));

  return {
    year,
    summary: () => summary.data?.statsSummary,
    yearStats: () => yearStats.data?.statsYear,
    isYearLoading: () => yearStats.fetching,
    selectedDate,
    selectYear,
    toggleDate,
  };
};
