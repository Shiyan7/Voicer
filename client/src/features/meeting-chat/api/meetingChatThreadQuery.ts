import type { ChatThreadOutput, QueryMeetingChatThreadArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_CHAT_THREAD_QUERY } from './gql/MEETING_CHAT_THREAD_QUERY';

interface MeetingChatThreadQueryResult {
  meetingChatThread: Pick<ChatThreadOutput, 'id'>;
}

type MeetingChatThreadQueryOptions = Omit<
  CreateQueryArgs<MeetingChatThreadQueryResult, QueryMeetingChatThreadArgs>,
  'query' | 'variables'
>;

export const meetingChatThreadQuery = (
  variables: () => QueryMeetingChatThreadArgs,
  options?: MeetingChatThreadQueryOptions,
) =>
  createQuery<MeetingChatThreadQueryResult, QueryMeetingChatThreadArgs>({
    query: MEETING_CHAT_THREAD_QUERY,
    variables,
    ...options,
  });
