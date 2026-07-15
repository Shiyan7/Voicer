import type { UserMeOutput } from '@schema';
import { createQuery } from '@urql/solid';
import type { Accessor } from 'solid-js';

import { USER_ME_QUERY } from './gql/USER_ME_QUERY';

interface UserMeQuery {
  userMe: UserMeOutput;
}

export const userMeQuery = (pause: Accessor<boolean>) =>
  createQuery<UserMeQuery>({
    query: USER_ME_QUERY,
    requestPolicy: 'network-only',
    pause,
  });
