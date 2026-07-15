import type { UserMeOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { USER_ME_QUERY } from './gql/USER_ME_QUERY';

interface UserMeQuery {
  userMe: UserMeOutput;
}

export const userMeQuery = (args: Omit<CreateQueryArgs, 'query'>) =>
  createQuery<UserMeQuery>({
    query: USER_ME_QUERY,
    requestPolicy: 'network-only',
    ...args,
  });
