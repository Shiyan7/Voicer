import { gql } from '@urql/solid';

export const STATS_QUERY = gql`
  query Stats($input: StatsInput!) {
    stats(input: $input) {
      years
      days {
        date
        count
        durationSec
      }
      summary {
        count
        durationSec
        activeDays
        longestStreak
      }
      sources {
        source
        count
        durationSec
      }
    }
  }
`;
