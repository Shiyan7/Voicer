import { gql } from '@urql/solid';

export const MEETING_UPDATED_SUBSCRIPTION = gql`
  subscription MeetingUpdated($id: ID!) {
    meetingUpdated(id: $id) {
      id
      title
      status
      source
      audioUrl
      startedAt
      endedAt
      durationSec
      isFavorite
      summarizationFailed
    }
  }
`;
