import type { MutationSetChatThreadPinnedArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { ChatThreadSummary } from '../types/ChatThreadSummary';
import { SET_CHAT_THREAD_PINNED_MUTATION } from './gql/SET_CHAT_THREAD_PINNED_MUTATION';

interface SetChatThreadPinnedMutation {
  setChatThreadPinned: Pick<ChatThreadSummary, 'id' | 'isPinned'>;
}

export const setChatThreadPinnedMutation = () =>
  createMutation<SetChatThreadPinnedMutation, MutationSetChatThreadPinnedArgs>(
    SET_CHAT_THREAD_PINNED_MUTATION,
  );
