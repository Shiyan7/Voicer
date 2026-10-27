import type { QueryStatsDayArgs, StatsDayMeetingOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { STATS_DAY_QUERY } from './gql/STATS_DAY_QUERY';

interface StatsDayQueryResult {
  statsDay: StatsDayMeetingOutput[];
}

type StatsDayQueryOptions = Omit<
  CreateQueryArgs<StatsDayQueryResult, QueryStatsDayArgs>,
  'query' | 'variables'
>;

export const statsDayQuery = (
  variables: () => QueryStatsDayArgs,
  options?: StatsDayQueryOptions,
) =>
  createQuery<StatsDayQueryResult, QueryStatsDayArgs>({
    query: STATS_DAY_QUERY,
    variables,
    requestPolicy: 'cache-and-network',
    ...options,
  });
