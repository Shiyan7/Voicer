import { i18n } from '@/shared/i18n';
import { formatShortDateTime } from '@/shared/lib/time';

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

  return `${prefix}, ${formatShortDateTime(meeting.startedAt)}`;
}

export const getMeetingTitle = (meeting: MeetingTitleSource): string =>
  meeting.title || getAutoTitle(meeting);
