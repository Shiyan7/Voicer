import { gql } from '@urql/solid';

export const MEETING_SCREENSHOTS_QUERY = gql`
  query MeetingScreenshots($meetingId: ID!) {
    meetingScreenshots(meetingId: $meetingId) {
      id
      offsetMs
      url
      thumbUrl
    }
  }
`;
