import type { MeetingsPageOutput, QueryMeetingsPageArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETINGS_PAGE_QUERY } from './gql/MEETINGS_PAGE_QUERY';

interface MeetingsPageQueryResult {
  meetingsPage: MeetingsPageOutput;
}

type MeetingsPageQueryOptions = Omit<
  CreateQueryArgs<MeetingsPageQueryResult, QueryMeetingsPageArgs>,
  'query' | 'variables'
>;

export const meetingsPageQuery = (
  variables: () => QueryMeetingsPageArgs,
  options?: MeetingsPageQueryOptions,
) =>
  createQuery<MeetingsPageQueryResult, QueryMeetingsPageArgs>({
    query: MEETINGS_PAGE_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
