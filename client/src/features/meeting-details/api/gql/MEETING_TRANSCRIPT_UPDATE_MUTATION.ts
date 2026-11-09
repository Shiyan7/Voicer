import { gql } from '@urql/solid';

export const MEETING_TRANSCRIPT_UPDATE_MUTATION = gql`
  mutation MeetingTranscriptUpdate(
    $meetingId: ID!
    $segments: [TranscriptSegmentTextInput!]!
  ) {
    meetingTranscriptUpdate(meetingId: $meetingId, segments: $segments) {
      id
      meetingId
      speakerIndex
      startMs
      endMs
      text
    }
  }
`;
