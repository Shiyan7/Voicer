import { i18n } from '@/shared/i18n';
import { withDateSuffix } from '@/shared/lib/time';

interface MeetingTitleSource {
  title?: string | null;
  source?: string | null;
  startedAt?: Date | string | number | null;
}

const getAutoTitle = (meeting: MeetingTitleSource): string =>
  withDateSuffix(
    meeting.source
      ? i18n.t('meetings.title_with_source', { source: meeting.source })
      : i18n.t('meetings.title_untitled'),
    meeting.startedAt,
  );

export const getMeetingTitle = (meeting: MeetingTitleSource): string =>
  meeting.title || getAutoTitle(meeting);
