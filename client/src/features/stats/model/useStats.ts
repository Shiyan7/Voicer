import { createEffect, createSignal, on } from 'solid-js';

import { authRoot } from '@/shared/roots/authRoot';

import { statsSummaryQuery } from '../api/statsSummaryQuery';
import { statsYearQuery } from '../api/statsYearQuery';
import { getTimeZone } from '../lib/getTimeZone';

export const useStats = () => {
  const timeZone = getTimeZone();
  const currentYear = new Date().getFullYear();

  const [year, setYear] = createSignal(currentYear);
  const [selectedDate, setSelectedDate] = createSignal<string | null>(null);

  const pause = () => !authRoot.isAuth;

  const [summaryResult] = statsSummaryQuery(() => ({ input: { timeZone } }), {
    pause,
  });

  const [yearResult] = statsYearQuery(
    () => ({ input: { year: year(), timeZone } }),
    { pause },
  );

  const summary = () => summaryResult.data?.statsSummary;

  const yearStats = () => yearResult.data?.statsYear;

  const years = () =>
    [...new Set([currentYear, ...(summary()?.years ?? [])])].sort(
      (a, b) => b - a,
    );

  const isYearLoading = () => yearResult.fetching && !yearStats();

  const hasError = () => Boolean(summaryResult.error || yearResult.error);

  const toggleDate = (date: string) =>
    setSelectedDate((current) => (current === date ? null : date));

  createEffect(on(year, () => setSelectedDate(null), { defer: true }));

  return {
    year,
    years,
    summary,
    yearStats,
    selectedDate,
    isYearLoading,
    hasError,
    setYear,
    toggleDate,
  };
};
