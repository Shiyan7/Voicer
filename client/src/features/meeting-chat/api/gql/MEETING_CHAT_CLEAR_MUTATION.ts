import { gql } from '@urql/solid';

export const MEETING_CHAT_CLEAR_MUTATION = gql`
  mutation MeetingChatClear($meetingId: ID!) {
    meetingChatClear(meetingId: $meetingId)
  }
`;
