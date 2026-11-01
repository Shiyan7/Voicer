import type { InterviewSessionOutput } from '@schema';
import { createQuery } from '@urql/solid';

import { INTERVIEW_SESSIONS_QUERY } from './gql/INTERVIEW_SESSIONS_QUERY';

interface InterviewSessionsQuery {
  interviewSessions: Pick<
    InterviewSessionOutput,
    | 'id'
    | 'vacancyText'
    | 'finishedAt'
    | 'meetingId'
    | 'recordingUrl'
    | 'createdAt'
  >[];
}

export const interviewSessionsQuery = () =>
  createQuery<InterviewSessionsQuery>({
    query: INTERVIEW_SESSIONS_QUERY,
    requestPolicy: 'network-only',
  });
