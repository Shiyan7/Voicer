import { gql } from '@urql/solid';

export const STATS_SUMMARY_QUERY = gql`
  query StatsSummary($input: StatsSummaryInput!) {
    statsSummary(input: $input) {
      years
      count
      durationSec
      activeDays
      longestStreak
    }
  }
`;
