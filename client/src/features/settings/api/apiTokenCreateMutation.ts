import type {
  ApiTokenCreatedOutput,
  MutationApiTokenCreateArgs,
} from '@schema';
import { createMutation } from '@urql/solid';

import { API_TOKEN_CREATE_MUTATION } from './gql/API_TOKEN_CREATE_MUTATION';

interface ApiTokenCreateMutation {
  apiTokenCreate: ApiTokenCreatedOutput;
}

export const apiTokenCreateMutation = () =>
  createMutation<ApiTokenCreateMutation, MutationApiTokenCreateArgs>(
    API_TOKEN_CREATE_MUTATION,
  );
