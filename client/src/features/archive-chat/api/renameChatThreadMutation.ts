import type { MutationRenameChatThreadArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { ChatThreadSummary } from '../types/ChatThreadSummary';
import { RENAME_CHAT_THREAD_MUTATION } from './gql/RENAME_CHAT_THREAD_MUTATION';

interface RenameChatThreadMutation {
  renameChatThread: ChatThreadSummary;
}

export const renameChatThreadMutation = () =>
  createMutation<RenameChatThreadMutation, MutationRenameChatThreadArgs>(
    RENAME_CHAT_THREAD_MUTATION,
  );
