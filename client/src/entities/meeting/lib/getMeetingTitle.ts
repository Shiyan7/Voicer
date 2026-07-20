import { i18n } from '@/shared/i18n';

export function getMeetingTitle(
  source?: string | null,
  startedAt?: Date | string | number | null,
): string {
  const prefix = source
    ? i18n.t('meetings.title_with_source', { source })
    : i18n.t('meetings.title_untitled');

  if (!startedAt) return prefix;

  const dateTime = new Intl.DateTimeFormat(i18n.locale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(startedAt));

  return `${prefix}, ${dateTime}`;
}
