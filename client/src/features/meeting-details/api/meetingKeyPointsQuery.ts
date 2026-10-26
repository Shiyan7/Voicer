import type { KeyPointOutput, QueryMeetingKeyPointsArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_KEY_POINTS_QUERY } from './gql/MEETING_KEY_POINTS_QUERY';

interface MeetingKeyPointsQueryResult {
  meetingKeyPoints: KeyPointOutput[];
}

type MeetingKeyPointsQueryOptions = Omit<
  CreateQueryArgs<MeetingKeyPointsQueryResult, QueryMeetingKeyPointsArgs>,
  'query' | 'variables'
>;

export const meetingKeyPointsQuery = (
  variables: () => QueryMeetingKeyPointsArgs,
  options?: MeetingKeyPointsQueryOptions,
) =>
  createQuery<MeetingKeyPointsQueryResult, QueryMeetingKeyPointsArgs>({
    query: MEETING_KEY_POINTS_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
