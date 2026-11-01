import type { InterviewSessionOutput } from '@schema';

import { getInterviewSessionTitle } from '@/entities/interview-session';
import { i18n } from '@/shared/i18n';
import { formatRelativeTime, formatShortDateTime } from '@/shared/lib/time';
import { paths } from '@/shared/router';

import { InterviewRowData } from '../types/InterviewRowData';

export const mapInterviewRows = (
  sessions: Pick<
    InterviewSessionOutput,
    'id' | 'title' | 'finishedAt' | 'createdAt'
  >[],
): InterviewRowData[] =>
  sessions.map((session) => ({
    id: session.id,
    href: paths.liveSession(session.id),
    title: getInterviewSessionTitle(session),
    status: session.finishedAt ? null : i18n.t('live.unfinished'),
    dateLabel: formatRelativeTime(session.createdAt),
    dateTitle: formatShortDateTime(session.createdAt),
  }));
