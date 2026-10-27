import { gql } from '@urql/solid';

export const STATS_DAY_MEETINGS_QUERY = gql`
  query StatsDayMeetings($input: StatsDayMeetingsInput!) {
    statsDayMeetings(input: $input) {
      id
      title
      source
      startedAt
      durationSec
    }
  }
`;
