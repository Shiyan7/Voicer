import { i18n } from '@/shared/i18n';

export const formatDuration = (totalSeconds: number) => {
  const totalMinutes = Math.round(Math.max(0, totalSeconds) / 60);
  const hours = String(Math.floor(totalMinutes / 60));
  const minutes = String(totalMinutes % 60);

  if (hours === '0') return i18n.t('duration.minutes', { minutes });
  if (minutes === '0') return i18n.t('duration.hours', { hours });

  return i18n.t('duration.hours_minutes', { hours, minutes });
};

export const formatDurationLabel = (totalSeconds?: number | null) =>
  totalSeconds ? formatDuration(totalSeconds) : null;

export const formatClock = (totalSeconds: number) => {
  const total = Math.max(0, Math.floor(totalSeconds));
  const seconds = String(total % 60).padStart(2, '0');

  return `${Math.floor(total / 60)}:${seconds}`;
};

export const formatClockMs = (totalMs: number) => formatClock(totalMs / 1000);
