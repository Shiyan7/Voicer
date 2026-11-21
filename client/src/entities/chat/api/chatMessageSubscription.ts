import type { ChatMessageOutput, SubscriptionChatMessageArgs } from '@schema';
import { createSubscription, CreateSubscriptionArgs } from '@urql/solid';
import { Accessor } from 'solid-js';

import { CHAT_MESSAGE_SUBSCRIPTION } from './gql/CHAT_MESSAGE_SUBSCRIPTION';

interface ChatMessageResult {
  chatMessage: ChatMessageOutput;
}

type ChatMessageSubscriptionOptions = Omit<
  CreateSubscriptionArgs<ChatMessageResult, SubscriptionChatMessageArgs>,
  'query' | 'variables'
>;

export const chatMessageSubscription = (
  variables: Accessor<SubscriptionChatMessageArgs>,
  onMessage: (message: ChatMessageOutput) => void,
  options?: ChatMessageSubscriptionOptions,
) =>
  createSubscription<ChatMessageResult>(
    {
      query: CHAT_MESSAGE_SUBSCRIPTION,
      variables,
      ...options,
    },
    (_, event) => {
      onMessage(event.chatMessage);
      return event;
    },
  );
