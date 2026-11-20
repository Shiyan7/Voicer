import { gql } from '@urql/solid';

export const MEETING_CHAT_THREAD_QUERY = gql`
  query MeetingChatThread($meetingId: ID!) {
    meetingChatThread(meetingId: $meetingId) {
      id
    }
  }
`;
