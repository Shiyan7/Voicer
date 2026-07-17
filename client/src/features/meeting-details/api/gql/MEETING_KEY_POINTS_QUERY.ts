import { gql } from '@urql/solid';

export const MEETING_KEY_POINTS_QUERY = gql`
  query MeetingKeyPoints($meetingId: ID!) {
    meetingKeyPoints(meetingId: $meetingId) {
      id
      text
      atMs
      order
    }
  }
`;
