import { i18n } from '@/shared/i18n';

interface MeetingTitleSource {
  title?: string | null;
  source?: string | null;
  startedAt?: Date | string | number | null;
}

function getAutoTitle(meeting: MeetingTitleSource): string {
  const prefix = meeting.source
    ? i18n.t('meetings.title_with_source', { source: meeting.source })
    : i18n.t('meetings.title_untitled');

  if (!meeting.startedAt) return prefix;

  const dateTime = new Intl.DateTimeFormat(i18n.locale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(meeting.startedAt));

  return `${prefix}, ${dateTime}`;
}

export const getMeetingTitle = (meeting: MeetingTitleSource): string =>
  meeting.title || getAutoTitle(meeting);
