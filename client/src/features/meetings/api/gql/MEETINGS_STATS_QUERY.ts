import { gql } from '@urql/solid';

export const MEETINGS_STATS_QUERY = gql`
  query MeetingsStats($input: MeetingsStatsInput!) {
    meetingsStats(input: $input) {
      weekCount
      weekDurationSec
      todayDurationSec
      openActionItems
      sources
    }
  }
`;
