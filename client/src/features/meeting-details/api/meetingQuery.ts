import type { MeetingOutput, QueryMeetingArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_QUERY } from './gql/MEETING_QUERY';

interface MeetingQueryResult {
  meeting: MeetingOutput;
}

type MeetingQueryOptions = Omit<
  CreateQueryArgs<MeetingQueryResult, QueryMeetingArgs>,
  'query' | 'variables'
>;

export const meetingQuery = (
  variables: QueryMeetingArgs,
  options?: MeetingQueryOptions,
) =>
  createQuery<MeetingQueryResult, QueryMeetingArgs>({
    query: MEETING_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
