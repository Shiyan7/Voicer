import type { MutationApiTokenRevokeArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { API_TOKEN_REVOKE_MUTATION } from './gql/API_TOKEN_REVOKE_MUTATION';

interface ApiTokenRevokeMutation {
  apiTokenRevoke: boolean;
}

export const apiTokenRevokeMutation = () =>
  createMutation<ApiTokenRevokeMutation, MutationApiTokenRevokeArgs>(
    API_TOKEN_REVOKE_MUTATION,
  );
