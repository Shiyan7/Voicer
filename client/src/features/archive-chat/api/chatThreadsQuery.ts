import type { ChatThreadOutput } from '@schema';
import { createQuery } from '@urql/solid';

import { CHAT_THREADS_QUERY } from './gql/CHAT_THREADS_QUERY';

interface ChatThreadsQueryResult {
  chatThreads: Pick<ChatThreadOutput, 'id' | 'title'>[];
}

export const chatThreadsQuery = () =>
  createQuery<ChatThreadsQueryResult>({
    query: CHAT_THREADS_QUERY,
    requestPolicy: 'cache-and-network',
  });
