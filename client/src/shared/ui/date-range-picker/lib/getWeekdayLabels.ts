import { date } from '@/shared/lib/time';

export const getWeekdayLabels = () =>
  Array.from({ length: 7 }, (_, index) =>
    date()
      .isoWeekday(index + 1)
      .format('dd'),
  );
