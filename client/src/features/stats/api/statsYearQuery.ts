import type { QueryStatsYearArgs, StatsYearOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { STATS_YEAR_QUERY } from './gql/STATS_YEAR_QUERY';

interface Result {
  statsYear: StatsYearOutput;
}

type Options = Omit<
  CreateQueryArgs<Result, QueryStatsYearArgs>,
  'query' | 'variables'
>;

export const statsYearQuery = (
  variables: () => QueryStatsYearArgs,
  options?: Options,
) =>
  createQuery<Result, QueryStatsYearArgs>({
    query: STATS_YEAR_QUERY,
    variables,
    requestPolicy: 'cache-and-network',
    ...options,
  });
