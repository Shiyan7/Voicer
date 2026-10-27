import { i18n } from '@/shared/i18n';

export function formatDuration(totalSeconds: number) {
  const totalMinutes = Math.round(Math.max(0, totalSeconds) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = String(totalMinutes % 60);

  if (!hours) return i18n.t('duration.minutes', { minutes });
  if (minutes === '0') return i18n.t('duration.hours', { hours: String(hours) });

  return i18n.t('duration.hours_minutes', { hours: String(hours), minutes });
}
