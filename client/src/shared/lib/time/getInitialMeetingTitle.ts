import { i18n } from '@/shared/i18n';

export function getInitialMeetingTitle(date: Date | string | number) {
  const dateTime = new Intl.DateTimeFormat(i18n.locale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

  return `${i18n.t('meetings.untitled_short')}, ${dateTime}`;
}
