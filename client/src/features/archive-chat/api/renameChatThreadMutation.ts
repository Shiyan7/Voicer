import type { ChatThreadOutput, MutationRenameChatThreadArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { RENAME_CHAT_THREAD_MUTATION } from './gql/RENAME_CHAT_THREAD_MUTATION';

interface RenameChatThreadMutation {
  renameChatThread: Pick<ChatThreadOutput, 'id' | 'title'>;
}

export const renameChatThreadMutation = () =>
  createMutation<RenameChatThreadMutation, MutationRenameChatThreadArgs>(
    RENAME_CHAT_THREAD_MUTATION,
  );
