import { InterviewMode, type InterviewSessionOutput } from '@schema';

import { getInterviewSessionTitle } from '@/entities/interview-session';
import { i18n } from '@/shared/i18n';
import { formatRelativeTime, formatShortDateTime } from '@/shared/lib/time';
import { paths } from '@/shared/router';

import { InterviewRowData } from '../types/InterviewRowData';

const getRowHref = (
  session: Pick<InterviewSessionOutput, 'id' | 'mode' | 'finishedAt'>,
): string =>
  session.mode === InterviewMode.Real && !session.finishedAt
    ? paths.liveBriefing(session.id)
    : paths.liveSession(session.id);

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
    href: getRowHref(session),
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
