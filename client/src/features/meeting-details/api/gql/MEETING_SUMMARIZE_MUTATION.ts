import { gql } from '@urql/solid';

export const MEETING_SUMMARIZE_MUTATION = gql`
  mutation MeetingSummarize($id: ID!) {
    meetingSummarize(id: $id) {
      id
      status
    }
  }
`;
