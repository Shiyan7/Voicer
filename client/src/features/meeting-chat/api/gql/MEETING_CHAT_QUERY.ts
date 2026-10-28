import { gql } from '@urql/solid';

import { CHAT_MESSAGE_FIELDS } from './CHAT_MESSAGE_FIELDS';

export const MEETING_CHAT_QUERY = gql`
  query MeetingChat($meetingId: ID!) {
    meetingChat(meetingId: $meetingId) {
      suggestedQuestions
      messages {
        ${CHAT_MESSAGE_FIELDS}
      }
    }
  }
`;
