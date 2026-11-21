import type { ChatThreadOutput } from '@schema';
import { createMutation } from '@urql/solid';

import { CREATE_CHAT_THREAD_MUTATION } from './gql/CREATE_CHAT_THREAD_MUTATION';

interface CreateChatThreadMutation {
  createChatThread: Pick<ChatThreadOutput, 'id'>;
}

export const createChatThreadMutation = () =>
  createMutation<CreateChatThreadMutation>(CREATE_CHAT_THREAD_MUTATION);
