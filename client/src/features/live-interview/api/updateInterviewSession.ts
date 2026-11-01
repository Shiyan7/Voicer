import type { MutationUpdateInterviewSessionArgs } from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { UPDATE_INTERVIEW_SESSION_MUTATION } from './gql/UPDATE_INTERVIEW_SESSION_MUTATION';

export const updateInterviewSession = async (
  variables: MutationUpdateInterviewSessionArgs,
) => {
  const result = await urqlClient
    .mutation(UPDATE_INTERVIEW_SESSION_MUTATION, variables)
    .toPromise();
  if (result.error) throw result.error;
};
