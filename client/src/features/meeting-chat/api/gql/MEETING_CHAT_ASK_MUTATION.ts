import { gql } from '@urql/solid';

import { CHAT_MESSAGE_FIELDS } from './CHAT_MESSAGE_FIELDS';

export const MEETING_CHAT_ASK_MUTATION = gql`
  mutation MeetingChatAsk($meetingId: ID!, $question: String!) {
    meetingChatAsk(meetingId: $meetingId, question: $question) {
      ${CHAT_MESSAGE_FIELDS}
    }
  }
`;
