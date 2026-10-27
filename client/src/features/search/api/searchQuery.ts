import type { QuerySearchArgs, SearchPageOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { SEARCH_QUERY } from './gql/SEARCH_QUERY';

interface SearchQueryResult {
  search: SearchPageOutput;
}

type SearchQueryOptions = Omit<
  CreateQueryArgs<SearchQueryResult, QuerySearchArgs>,
  'query' | 'variables'
>;

export const searchQuery = (
  variables: () => QuerySearchArgs,
  options?: SearchQueryOptions,
) =>
  createQuery<SearchQueryResult, QuerySearchArgs>({
    query: SEARCH_QUERY,
    variables,
    requestPolicy: 'cache-and-network',
    ...options,
  });
