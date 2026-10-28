import type { ChatMessageOutput, MutationMeetingChatAskArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_CHAT_ASK_MUTATION } from './gql/MEETING_CHAT_ASK_MUTATION';

interface MeetingChatAskMutation {
  meetingChatAsk: ChatMessageOutput;
}

export const meetingChatAskMutation = () =>
  createMutation<MeetingChatAskMutation, MutationMeetingChatAskArgs>(
    MEETING_CHAT_ASK_MUTATION,
  );
