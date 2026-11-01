import type { MutationUpdateInterviewSessionArgs } from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { UPDATE_INTERVIEW_SESSION_MUTATION } from './gql/UPDATE_INTERVIEW_SESSION_MUTATION';

export const updateInterviewSession = async (
  variables: MutationUpdateInterviewSessionArgs,
) => {
  await urqlClient
    .mutation(UPDATE_INTERVIEW_SESSION_MUTATION, variables)
    .toPromise();
};
