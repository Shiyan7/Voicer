import { gql } from '@urql/solid';

export const MEETINGS_PAGE_QUERY = gql`
  query MeetingsPage($input: MeetingsPageInput!) {
    meetingsPage(input: $input) {
      items {
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
      meta {
        page
        hasNextItems
        hasPrevItems
        total
      }
    }
  }
`;
