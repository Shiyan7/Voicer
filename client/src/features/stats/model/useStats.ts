import { createEffect, createSignal, on } from 'solid-js';

import { authRoot } from '@/shared/roots/authRoot';

import { statsQuery } from '../api/statsQuery';
import { getTimeZone } from '../lib/getTimeZone';

export const useStats = () => {
  const timeZone = getTimeZone();
  const currentYear = new Date().getFullYear();

  const [year, setYear] = createSignal(currentYear);
  const [selectedDate, setSelectedDate] = createSignal<string | null>(null);

  const [result] = statsQuery(
    () => ({ input: { year: year(), timeZone } }),
    { pause: () => !authRoot.isAuth },
  );

  const stats = () => result.data?.stats;

  const years = () =>
    [...new Set([currentYear, ...(stats()?.years ?? [])])].sort(
      (a, b) => b - a,
    );

  const isLoading = () => result.fetching && !stats();

  const toggleDate = (date: string) =>
    setSelectedDate((current) => (current === date ? null : date));

  createEffect(on(year, () => setSelectedDate(null), { defer: true }));

  return {
    timeZone,
    year,
    years,
    stats,
    selectedDate,
    isLoading,
    setYear,
    toggleDate,
  };
};
