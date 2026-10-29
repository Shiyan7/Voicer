import type { ApiTokenOutput } from '@schema';
import { createQuery } from '@urql/solid';

import { API_TOKENS_QUERY } from './gql/API_TOKENS_QUERY';

interface ApiTokensQuery {
  apiTokens: ApiTokenOutput[];
}

export const apiTokensQuery = () =>
  createQuery<ApiTokensQuery>({
    query: API_TOKENS_QUERY,
    requestPolicy: 'network-only',
  });
