import type { QueryStatsSummaryArgs, StatsSummaryOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { STATS_SUMMARY_QUERY } from './gql/STATS_SUMMARY_QUERY';

interface Result {
  statsSummary: StatsSummaryOutput;
}

type Options = Omit<CreateQueryArgs<Result, QueryStatsSummaryArgs>, 'query' | 'variables'>;

export const statsSummaryQuery = (variables: () => QueryStatsSummaryArgs, options?: Options) =>
  createQuery<Result, QueryStatsSummaryArgs>({
    query: STATS_SUMMARY_QUERY,
    variables,
    requestPolicy: 'cache-and-network',
    ...options,
  });
