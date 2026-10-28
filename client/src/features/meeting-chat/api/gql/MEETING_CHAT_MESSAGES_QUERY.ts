import { gql } from '@urql/solid';

import { CHAT_MESSAGE_FIELDS } from './CHAT_MESSAGE_FIELDS';

export const MEETING_CHAT_MESSAGES_QUERY = gql`
  query MeetingChatMessages($meetingId: ID!) {
    meetingChatMessages(meetingId: $meetingId) {
      ${CHAT_MESSAGE_FIELDS}
    }
  }
`;
