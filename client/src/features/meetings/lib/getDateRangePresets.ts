import { i18n } from '@/shared/i18n';
import { date, toDateKey } from '@/shared/lib/time';
import type { DateRangePreset } from '@/shared/ui/date-range-picker';

const lastDays = (count: number) => ({
  from: toDateKey(date().subtract(count - 1, 'day')),
  to: toDateKey(),
});

export const getDateRangePresets = (): DateRangePreset[] => [
  {
    label: i18n.t('meetings.date_filter.today'),
    range: { from: toDateKey(), to: toDateKey() },
  },
  {
    label: i18n.t('meetings.date_filter.yesterday'),
    range: {
      from: toDateKey(date().subtract(1, 'day')),
      to: toDateKey(date().subtract(1, 'day')),
    },
  },
  { label: i18n.t('meetings.date_filter.last_7_days'), range: lastDays(7) },
  { label: i18n.t('meetings.date_filter.last_30_days'), range: lastDays(30) },
  {
    label: i18n.t('meetings.date_filter.this_month'),
    range: { from: toDateKey(date().startOf('month')), to: toDateKey() },
  },
  {
    label: i18n.t('meetings.date_filter.last_month'),
    range: {
      from: toDateKey(date().subtract(1, 'month').startOf('month')),
      to: toDateKey(date().subtract(1, 'month').endOf('month')),
    },
  },
];
