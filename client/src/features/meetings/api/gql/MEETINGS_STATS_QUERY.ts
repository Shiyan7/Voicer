import { gql } from '@urql/solid';

export const MEETINGS_STATS_QUERY = gql`
  query MeetingsStats {
    meetingsStats {
      weekCount
      weekDurationSec
      openActionItems
      sources
    }
  }
`;
