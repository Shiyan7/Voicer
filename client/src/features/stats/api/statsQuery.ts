import type { QueryStatsArgs, StatsOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { STATS_QUERY } from './gql/STATS_QUERY';

interface StatsQueryResult {
  stats: StatsOutput;
}

type StatsQueryOptions = Omit<
  CreateQueryArgs<StatsQueryResult, QueryStatsArgs>,
  'query' | 'variables'
>;

export const statsQuery = (
  variables: () => QueryStatsArgs,
  options?: StatsQueryOptions,
) =>
  createQuery<StatsQueryResult, QueryStatsArgs>({
    query: STATS_QUERY,
    variables,
    requestPolicy: 'cache-and-network',
    ...options,
  });
