import { gql } from '@urql/solid';

export const MEETING_SUMMARIZE_MUTATION = gql`
  mutation MeetingSummarize($id: ID!, $style: SummaryStyle) {
    meetingSummarize(id: $id, style: $style) {
      id
      status
      summaryStyle
    }
  }
`;
