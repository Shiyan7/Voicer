import { gql } from '@urql/solid';

export const DELETE_INTERVIEW_SESSION_MUTATION = gql`
  mutation DeleteInterviewSession($id: ID!) {
    deleteInterviewSession(id: $id) {
      id
    }
  }
`;
