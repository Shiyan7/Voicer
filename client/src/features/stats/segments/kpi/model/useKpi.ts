import { i18n } from '@/shared/i18n';

import { formatDays } from '../../../lib/formatDays';
import { formatDuration } from '../../../lib/formatDuration';
import { KpiProps } from '../types/KpiProps';
import { KpiTile } from '../types/KpiTile';

export const useKpi = (props: KpiProps) => {
  const tiles = (): KpiTile[] => {
    const summary = props.summary;
    if (!summary) return [];

    const avgDay = summary.activeDays
      ? Math.round(summary.durationSec / summary.activeDays)
      : 0;

    return [
      { label: i18n.t('stats.kpi.calls'), value: String(summary.count) },
      {
        label: i18n.t('stats.kpi.duration'),
        value: formatDuration(summary.durationSec),
      },
      {
        label: i18n.t('stats.kpi.active_days'),
        value: String(summary.activeDays),
      },
      { label: i18n.t('stats.kpi.avg_day'), value: formatDuration(avgDay) },
      {
        label: i18n.t('stats.kpi.longest_streak'),
        value: formatDays(summary.longestStreak),
      },
    ];
  };

  const isLoading = () => !props.summary;

  return { tiles, isLoading };
};
