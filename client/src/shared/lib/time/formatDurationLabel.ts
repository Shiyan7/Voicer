import { formatDuration } from './formatDuration';

export function formatDurationLabel(totalSeconds?: number | null) {
  return totalSeconds ? formatDuration(totalSeconds) : null;
}
