import type { MutationMeetingChatClearArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_CHAT_CLEAR_MUTATION } from './gql/MEETING_CHAT_CLEAR_MUTATION';

interface MeetingChatClearMutation {
  meetingChatClear: boolean;
}

export const meetingChatClearMutation = () =>
  createMutation<MeetingChatClearMutation, MutationMeetingChatClearArgs>(
    MEETING_CHAT_CLEAR_MUTATION,
  );
