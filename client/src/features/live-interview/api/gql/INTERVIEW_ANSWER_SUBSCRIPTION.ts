import { gql } from '@urql/solid';

export const INTERVIEW_ANSWER_SUBSCRIPTION = gql`
  subscription InterviewAnswer($sessionId: ID!) {
    interviewAnswer(sessionId: $sessionId) {
      answerId
      question
      text
      done
    }
  }
`;
