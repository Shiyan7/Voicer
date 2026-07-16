import { gql } from '@urql/solid';

export const MEETINGS_QUERY = gql`
  query Meetings {
    meetings {
      id
      title
      status
      source
      startedAt
      endedAt
      durationSec
      createdAt
      updatedAt
    }
  }
`;
