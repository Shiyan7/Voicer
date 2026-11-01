import type { InterviewSessionOutput } from '@schema';
import { createQuery } from '@urql/solid';

import { urqlClient } from '@/shared/urql-client';

import { INTERVIEW_SESSIONS_QUERY } from './gql/INTERVIEW_SESSIONS_QUERY';

interface InterviewSessionsQuery {
  interviewSessions: Pick<
    InterviewSessionOutput,
    'id' | 'vacancyText' | 'finishedAt' | 'meetingId' | 'createdAt'
  >[];
}

export const interviewSessionsQuery = () =>
  createQuery<InterviewSessionsQuery>({
    query: INTERVIEW_SESSIONS_QUERY,
    requestPolicy: 'network-only',
  });

export const refetchInterviewSessions = async () => {
  const result = await urqlClient
    .query<InterviewSessionsQuery>(
      INTERVIEW_SESSIONS_QUERY,
      {},
      { requestPolicy: 'network-only' },
    )
    .toPromise();
  if (result.error) throw result.error;
};
