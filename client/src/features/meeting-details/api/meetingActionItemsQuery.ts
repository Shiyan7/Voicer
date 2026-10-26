import type { ActionItemOutput, QueryMeetingActionItemsArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_ACTION_ITEMS_QUERY } from './gql/MEETING_ACTION_ITEMS_QUERY';

interface MeetingActionItemsQueryResult {
  meetingActionItems: ActionItemOutput[];
}

type MeetingActionItemsQueryOptions = Omit<
  CreateQueryArgs<MeetingActionItemsQueryResult, QueryMeetingActionItemsArgs>,
  'query' | 'variables'
>;

export const meetingActionItemsQuery = (
  variables: () => QueryMeetingActionItemsArgs,
  options?: MeetingActionItemsQueryOptions,
) =>
  createQuery<MeetingActionItemsQueryResult, QueryMeetingActionItemsArgs>({
    query: MEETING_ACTION_ITEMS_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
