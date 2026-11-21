import type { MutationChatClearArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { CHAT_CLEAR_MUTATION } from './gql/CHAT_CLEAR_MUTATION';

interface ChatClearMutation {
  chatClear: boolean;
}

export const chatClearMutation = () =>
  createMutation<ChatClearMutation, MutationChatClearArgs>(CHAT_CLEAR_MUTATION);
