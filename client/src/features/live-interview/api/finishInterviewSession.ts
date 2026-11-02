import type { MutationFinishInterviewSessionArgs } from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { FINISH_INTERVIEW_SESSION_MUTATION } from './gql/FINISH_INTERVIEW_SESSION_MUTATION';

export const finishInterviewSession = async (
  variables: MutationFinishInterviewSessionArgs,
) => {
  await urqlClient
    .mutation(FINISH_INTERVIEW_SESSION_MUTATION, variables)
    .toPromise();
};
