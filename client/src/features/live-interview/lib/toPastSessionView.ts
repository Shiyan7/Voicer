import type { InterviewSessionOutput } from '@schema';

import { formatShortDateTime } from '@/shared/lib/time';

import { LivePastSessionView } from '../types/LivePastSessionView';

export const toPastSessionView = (
  session: Pick<
    InterviewSessionOutput,
    'id' | 'vacancyText' | 'finishedAt' | 'createdAt'
  >,
): LivePastSessionView => ({
  id: session.id,
  dateLabel: formatShortDateTime(session.createdAt),
  vacancyLabel: session.vacancyText.split('\n')[0],
  isFinished: !!session.finishedAt,
});
