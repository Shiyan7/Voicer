import { gql } from '@urql/solid';

export const DELETE_INTERVIEW_RESUME_MUTATION = gql`
  mutation DeleteInterviewResume($sessionId: ID!) {
    deleteInterviewResume(sessionId: $sessionId)
  }
`;
