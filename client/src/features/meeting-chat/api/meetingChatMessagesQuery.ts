import type { ChatMessageOutput, QueryMeetingChatMessagesArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_CHAT_MESSAGES_QUERY } from './gql/MEETING_CHAT_MESSAGES_QUERY';

interface MeetingChatMessagesQueryResult {
  meetingChatMessages: ChatMessageOutput[];
}

type MeetingChatMessagesQueryOptions = Omit<
  CreateQueryArgs<MeetingChatMessagesQueryResult, QueryMeetingChatMessagesArgs>,
  'query' | 'variables'
>;

export const meetingChatMessagesQuery = (
  variables: () => QueryMeetingChatMessagesArgs,
  options?: MeetingChatMessagesQueryOptions,
) =>
  createQuery<MeetingChatMessagesQueryResult, QueryMeetingChatMessagesArgs>({
    query: MEETING_CHAT_MESSAGES_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
