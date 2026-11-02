import { gql } from '@urql/solid';

export const FINISH_INTERVIEW_SESSION_MUTATION = gql`
  mutation FinishInterviewSession($id: ID!) {
    finishInterviewSession(id: $id) {
      id
    }
  }
`;
