import { InterviewMode, type InterviewSessionOutput } from '@schema';

import { getInterviewSessionTitle } from '@/entities/interview-session';
import { i18n } from '@/shared/i18n';
import { formatRelativeTime, formatShortDateTime } from '@/shared/lib/time';
import { paths } from '@/shared/router';

import { InterviewRowData } from '../types/InterviewRowData';

const getRowMeta = (isMock: boolean, isFinished: boolean): string | null => {
  const labels = [
    isMock && i18n.t('live.mode_filter.mock'),
    !isFinished && i18n.t('live.unfinished'),
  ].filter(Boolean);
  return labels.length ? labels.join(' · ') : null;
};

export const mapInterviewRows = (
  sessions: Pick<
    InterviewSessionOutput,
    'id' | 'title' | 'mode' | 'finishedAt' | 'createdAt'
  >[],
): InterviewRowData[] =>
  sessions.map((session) => ({
    id: session.id,
    href: paths.liveSession(session.id),
    title: getInterviewSessionTitle(session),
    icon:
      session.mode === InterviewMode.Mock ? 'common:chat' : 'common:microphone',
    status: getRowMeta(
      session.mode === InterviewMode.Mock,
      !!session.finishedAt,
    ),
    dateLabel: formatRelativeTime(session.createdAt),
    dateTitle: formatShortDateTime(session.createdAt),
  }));
