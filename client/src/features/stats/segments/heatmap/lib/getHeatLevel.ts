import { HeatLevel } from '../types/HeatLevel';

export const getHeatLevel = (
  count: number,
  durationSec: number,
  thresholds: number[],
): HeatLevel => {
  if (!count) return 0;
  const passed = thresholds.filter((threshold) => durationSec > threshold);
  return (passed.length + 1) as HeatLevel;
};
