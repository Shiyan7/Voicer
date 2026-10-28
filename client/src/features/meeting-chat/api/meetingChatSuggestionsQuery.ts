import type { QueryMeetingChatSuggestionsArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_CHAT_SUGGESTIONS_QUERY } from './gql/MEETING_CHAT_SUGGESTIONS_QUERY';

interface MeetingChatSuggestionsQueryResult {
  meetingChatSuggestions: string[];
}

type MeetingChatSuggestionsQueryOptions = Omit<
  CreateQueryArgs<
    MeetingChatSuggestionsQueryResult,
    QueryMeetingChatSuggestionsArgs
  >,
  'query' | 'variables'
>;

export const meetingChatSuggestionsQuery = (
  variables: () => QueryMeetingChatSuggestionsArgs,
  options?: MeetingChatSuggestionsQueryOptions,
) =>
  createQuery<
    MeetingChatSuggestionsQueryResult,
    QueryMeetingChatSuggestionsArgs
  >({
    query: MEETING_CHAT_SUGGESTIONS_QUERY,
    variables,
    ...options,
  });
