import type { StatsDayOutput } from '@schema';

import { HEAT_QUANTILES } from '../config/heatmapConfig';

export const getHeatThresholds = (days: StatsDayOutput[]) => {
  const durations = days
    .map((day) => day.durationSec)
    .filter((duration) => duration > 0)
    .sort((a, b) => a - b);

  return HEAT_QUANTILES.map(
    (quantile) => durations[Math.floor(quantile * durations.length)] ?? 0,
  );
};
