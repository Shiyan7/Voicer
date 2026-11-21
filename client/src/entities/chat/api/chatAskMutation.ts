import type { ChatMessageOutput, MutationChatAskArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { CHAT_ASK_MUTATION } from './gql/CHAT_ASK_MUTATION';

interface ChatAskMutation {
  chatAsk: ChatMessageOutput;
}

export const chatAskMutation = () =>
  createMutation<ChatAskMutation, MutationChatAskArgs>(CHAT_ASK_MUTATION);
