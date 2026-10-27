import type { QueryStatsDayMeetingsArgs, StatsDayMeetingOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { STATS_DAY_MEETINGS_QUERY } from './gql/STATS_DAY_MEETINGS_QUERY';

interface Result {
  statsDayMeetings: StatsDayMeetingOutput[];
}

type Options = Omit<
  CreateQueryArgs<Result, QueryStatsDayMeetingsArgs>,
  'query' | 'variables'
>;

export const statsDayMeetingsQuery = (
  variables: () => QueryStatsDayMeetingsArgs,
  options?: Options,
) =>
  createQuery<Result, QueryStatsDayMeetingsArgs>({
    query: STATS_DAY_MEETINGS_QUERY,
    variables,
    requestPolicy: 'cache-and-network',
    ...options,
  });
