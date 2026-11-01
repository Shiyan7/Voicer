import type { InterviewSessionOutput } from '@schema';

import { i18n } from '@/shared/i18n';
import { formatShortDateTime } from '@/shared/lib/time';

import { InterviewSessionView } from '../types/InterviewSessionView';

export const toInterviewSessionView = (
  session: Pick<
    InterviewSessionOutput,
    'id' | 'vacancyText' | 'finishedAt' | 'createdAt'
  >,
): InterviewSessionView => ({
  id: session.id,
  dateLabel: formatShortDateTime(session.createdAt),
  vacancyLabel: session.vacancyText.split('\n')[0],
  statusLabel: i18n.t(
    session.finishedAt
      ? 'live.prep.status_finished'
      : 'live.prep.status_unfinished',
  ),
  isFinished: !!session.finishedAt,
});
