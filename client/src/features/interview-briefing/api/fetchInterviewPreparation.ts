import type { QueryInterviewSessionArgs } from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { InterviewPreparation } from '../types/InterviewPreparation';
import { INTERVIEW_PREPARATION_QUERY } from './gql/INTERVIEW_PREPARATION_QUERY';

interface InterviewPreparationQuery {
  interviewSession: InterviewPreparation;
}

export const fetchInterviewPreparation = async (id: string) => {
  const result = await urqlClient
    .query<
      InterviewPreparationQuery,
      QueryInterviewSessionArgs
    >(INTERVIEW_PREPARATION_QUERY, { id }, { requestPolicy: 'network-only' })
    .toPromise();
  return result.data?.interviewSession ?? null;
};
