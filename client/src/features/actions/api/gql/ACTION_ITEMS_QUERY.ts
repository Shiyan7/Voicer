import { gql } from '@urql/solid';

export const ACTION_ITEMS_QUERY = gql`
  query ActionItems {
    actionItems {
      id
      meetingId
      text
      isDone
      createdAt
      meetingTitle
      meetingSource
      meetingStartedAt
    }
  }
`;
