import { gql } from '@urql/solid';

import { CHAT_MESSAGE_FIELDS } from './CHAT_MESSAGE_FIELDS';

export const MEETING_CHAT_MESSAGE_SUBSCRIPTION = gql`
  subscription MeetingChatMessage($meetingId: ID!) {
    meetingChatMessage(meetingId: $meetingId) {
      ${CHAT_MESSAGE_FIELDS}
    }
  }
`;
