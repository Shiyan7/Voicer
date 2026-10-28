import type { MeetingChatOutput, QueryMeetingChatArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_CHAT_QUERY } from './gql/MEETING_CHAT_QUERY';

interface MeetingChatQueryResult {
  meetingChat: MeetingChatOutput;
}

type MeetingChatQueryOptions = Omit<
  CreateQueryArgs<MeetingChatQueryResult, QueryMeetingChatArgs>,
  'query' | 'variables'
>;

export const meetingChatQuery = (
  variables: () => QueryMeetingChatArgs,
  options?: MeetingChatQueryOptions,
) =>
  createQuery<MeetingChatQueryResult, QueryMeetingChatArgs>({
    query: MEETING_CHAT_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
