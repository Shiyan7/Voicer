import { gql } from '@urql/solid';

export const INTERVIEW_TURNS_QUERY = gql`
  query InterviewTurns($sessionId: ID!) {
    interviewTurns(sessionId: $sessionId) {
      id
      question
      answer
    }
  }
`;
