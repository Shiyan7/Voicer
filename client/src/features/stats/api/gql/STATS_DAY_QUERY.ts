import { gql } from '@urql/solid';

export const STATS_DAY_QUERY = gql`
  query StatsDay($input: StatsDayInput!) {
    statsDay(input: $input) {
      id
      title
      source
      startedAt
      durationSec
    }
  }
`;
