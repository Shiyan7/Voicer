import { gql } from '@urql/solid';

export const INTERVIEW_SESSIONS_PAGE_QUERY = gql`
  query InterviewSessionsPage($input: InterviewSessionsPageInput!) {
    interviewSessionsPage(input: $input) {
      items {
        id
        title
        mode
        finishedAt
        createdAt
      }
      meta {
        page
        hasNextItems
        hasPrevItems
        total
      }
    }
  }
`;
