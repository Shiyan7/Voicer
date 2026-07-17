import { gql } from '@urql/solid';

export const MEETING_QUERY = gql`
  query Meeting($id: ID!) {
    meeting(id: $id) {
      id
      title
      status
      source
      audioUrl
      startedAt
      endedAt
      durationSec
    }
  }
`;
