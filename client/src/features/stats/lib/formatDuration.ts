import { formatDurationLabel } from '@/shared/lib/time';

export const formatDuration = (seconds: number) =>
  formatDurationLabel(seconds) ?? '0m';
