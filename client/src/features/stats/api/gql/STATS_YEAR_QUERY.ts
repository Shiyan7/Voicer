import { gql } from '@urql/solid';

export const STATS_YEAR_QUERY = gql`
  query StatsYear($input: StatsYearInput!) {
    statsYear(input: $input) {
      days {
        date
        count
        durationSec
      }
      sources {
        source
        count
        durationSec
      }
    }
  }
`;
