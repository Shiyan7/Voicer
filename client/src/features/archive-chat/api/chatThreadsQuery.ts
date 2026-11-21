import { createQuery } from '@urql/solid';

import { ChatThreadSummary } from '../types/ChatThreadSummary';
import { CHAT_THREADS_QUERY } from './gql/CHAT_THREADS_QUERY';

interface ChatThreadsQueryResult {
  chatThreads: ChatThreadSummary[];
}

export const chatThreadsQuery = () =>
  createQuery<ChatThreadsQueryResult>({
    query: CHAT_THREADS_QUERY,
    requestPolicy: 'cache-and-network',
  });
