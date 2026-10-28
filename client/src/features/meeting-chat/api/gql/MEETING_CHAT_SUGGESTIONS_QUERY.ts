import { gql } from '@urql/solid';

export const MEETING_CHAT_SUGGESTIONS_QUERY = gql`
  query MeetingChatSuggestions($meetingId: ID!) {
    meetingChatSuggestions(meetingId: $meetingId)
  }
`;
