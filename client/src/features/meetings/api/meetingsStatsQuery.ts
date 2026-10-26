import type { MeetingsStatsOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETINGS_STATS_QUERY } from './gql/MEETINGS_STATS_QUERY';

interface MeetingsStatsQueryResult {
  meetingsStats: MeetingsStatsOutput;
}

type MeetingsStatsQueryOptions = Omit<
  CreateQueryArgs<MeetingsStatsQueryResult>,
  'query' | 'variables'
>;

export const meetingsStatsQuery = (options?: MeetingsStatsQueryOptions) =>
  createQuery<MeetingsStatsQueryResult>({
    query: MEETINGS_STATS_QUERY,
    requestPolicy: 'cache-and-network',
    ...options,
  });
