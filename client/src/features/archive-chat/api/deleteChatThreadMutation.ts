import type { MutationDeleteChatThreadArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { DELETE_CHAT_THREAD_MUTATION } from './gql/DELETE_CHAT_THREAD_MUTATION';

interface DeleteChatThreadMutation {
  deleteChatThread: boolean;
}

export const deleteChatThreadMutation = () =>
  createMutation<DeleteChatThreadMutation, MutationDeleteChatThreadArgs>(
    DELETE_CHAT_THREAD_MUTATION,
  );
