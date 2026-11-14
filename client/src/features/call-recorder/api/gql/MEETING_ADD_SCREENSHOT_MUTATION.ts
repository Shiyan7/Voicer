import { gql } from '@urql/solid';

export const MEETING_ADD_SCREENSHOT_MUTATION = gql`
  mutation MeetingAddScreenshot(
    $meetingId: ID!
    $image: Upload!
    $offsetMs: Int!
  ) {
    meetingAddScreenshot(
      meetingId: $meetingId
      image: $image
      offsetMs: $offsetMs
    ) {
      id
    }
  }
`;
