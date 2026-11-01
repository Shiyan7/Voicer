import type { QueryInterviewSessionArgs } from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { LiveSessionDetails } from '../types/LiveSessionDetails';
import { INTERVIEW_SESSION_QUERY } from './gql/INTERVIEW_SESSION_QUERY';

interface InterviewSessionQuery {
  interviewSession: LiveSessionDetails;
}

export const fetchInterviewSession = async (id: string) => {
  const result = await urqlClient
    .query<
      InterviewSessionQuery,
      QueryInterviewSessionArgs
    >(INTERVIEW_SESSION_QUERY, { id }, { requestPolicy: 'network-only' })
    .toPromise();
  return result.data?.interviewSession;
};
