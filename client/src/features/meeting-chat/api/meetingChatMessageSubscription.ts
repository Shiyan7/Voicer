import type {
  ChatMessageOutput,
  SubscriptionMeetingChatMessageArgs,
} from '@schema';
import { createSubscription, CreateSubscriptionArgs } from '@urql/solid';
import { Accessor } from 'solid-js';

import { MEETING_CHAT_MESSAGE_SUBSCRIPTION } from './gql/MEETING_CHAT_MESSAGE_SUBSCRIPTION';

interface MeetingChatMessageResult {
  meetingChatMessage: ChatMessageOutput;
}

type MeetingChatMessageSubscriptionOptions = Omit<
  CreateSubscriptionArgs<
    MeetingChatMessageResult,
    SubscriptionMeetingChatMessageArgs
  >,
  'query' | 'variables'
>;

export const meetingChatMessageSubscription = (
  variables: Accessor<SubscriptionMeetingChatMessageArgs>,
  onMessage: (message: ChatMessageOutput) => void,
  options?: MeetingChatMessageSubscriptionOptions,
) =>
  createSubscription<MeetingChatMessageResult>(
    {
      query: MEETING_CHAT_MESSAGE_SUBSCRIPTION,
      variables,
      ...options,
    },
    (_, event) => {
      onMessage(event.meetingChatMessage);
      return event;
    },
  );
