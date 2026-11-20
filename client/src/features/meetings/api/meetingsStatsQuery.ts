import type { MeetingsStatsOutput, QueryMeetingsStatsArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETINGS_STATS_QUERY } from './gql/MEETINGS_STATS_QUERY';

interface MeetingsStatsQueryResult {
  meetingsStats: MeetingsStatsOutput;
}

type MeetingsStatsQueryOptions = Omit<
  CreateQueryArgs<MeetingsStatsQueryResult, QueryMeetingsStatsArgs>,
  'query' | 'variables'
>;

export const meetingsStatsQuery = (
  variables: () => QueryMeetingsStatsArgs,
  options?: MeetingsStatsQueryOptions,
) =>
  createQuery<MeetingsStatsQueryResult, QueryMeetingsStatsArgs>({
    query: MEETINGS_STATS_QUERY,
    variables,
    requestPolicy: 'cache-and-network',
    ...options,
  });
