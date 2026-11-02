import { gql } from '@urql/solid';

export const MEETING_TRANSCRIPT_QUERY = gql`
  query MeetingTranscript($meetingId: ID!) {
    meetingTranscript(meetingId: $meetingId) {
      id
      speakerIndex
      startMs
      endMs
      text
    }
  }
`;
