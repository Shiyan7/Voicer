import type { ChatMessageOutput, QueryChatMessagesArgs } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { CHAT_MESSAGES_QUERY } from './gql/CHAT_MESSAGES_QUERY';

interface ChatMessagesQueryResult {
  chatMessages: ChatMessageOutput[];
}

type ChatMessagesQueryOptions = Omit<
  CreateQueryArgs<ChatMessagesQueryResult, QueryChatMessagesArgs>,
  'query' | 'variables'
>;

export const chatMessagesQuery = (
  variables: () => QueryChatMessagesArgs,
  options?: ChatMessagesQueryOptions,
) =>
  createQuery<ChatMessagesQueryResult, QueryChatMessagesArgs>({
    query: CHAT_MESSAGES_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
