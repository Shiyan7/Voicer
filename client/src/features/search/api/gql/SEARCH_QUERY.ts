import { gql } from '@urql/solid';

export const SEARCH_QUERY = gql`
  query Search($input: SearchInput!) {
    search(input: $input) {
      meetingId
      matchId
      source
      startedAt
      durationSec
      kind
      text
      atMs
      matchCount
    }
  }
`;
