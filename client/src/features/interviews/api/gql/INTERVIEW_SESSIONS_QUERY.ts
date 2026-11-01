import { gql } from '@urql/solid';

export const INTERVIEW_SESSIONS_QUERY = gql`
  query InterviewSessions {
    interviewSessions {
      id
      title
      finishedAt
      createdAt
    }
  }
`;
