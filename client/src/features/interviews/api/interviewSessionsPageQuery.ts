import type {
  InterviewSessionsPageOutput,
  QueryInterviewSessionsPageArgs,
} from '@schema';
import { createQuery } from '@urql/solid';

import { INTERVIEW_SESSIONS_PAGE_QUERY } from './gql/INTERVIEW_SESSIONS_PAGE_QUERY';

interface InterviewSessionsPageQueryResult {
  interviewSessionsPage: InterviewSessionsPageOutput;
}

export const interviewSessionsPageQuery = (
  variables: () => QueryInterviewSessionsPageArgs,
) =>
  createQuery<InterviewSessionsPageQueryResult, QueryInterviewSessionsPageArgs>(
    {
      query: INTERVIEW_SESSIONS_PAGE_QUERY,
      variables,
      requestPolicy: 'network-only',
    },
  );
