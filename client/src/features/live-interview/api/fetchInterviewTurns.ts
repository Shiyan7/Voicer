import type { InterviewTurnOutput, QueryInterviewTurnsArgs } from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { INTERVIEW_TURNS_QUERY } from './gql/INTERVIEW_TURNS_QUERY';

interface InterviewTurnsQuery {
  interviewTurns: Pick<InterviewTurnOutput, 'id' | 'question' | 'answer'>[];
}

export const fetchInterviewTurns = async (sessionId: string) => {
  const result = await urqlClient
    .query<
      InterviewTurnsQuery,
      QueryInterviewTurnsArgs
    >(INTERVIEW_TURNS_QUERY, { sessionId }, { requestPolicy: 'network-only' })
    .toPromise();
  if (result.error) throw result.error;
  return result.data?.interviewTurns ?? [];
};
