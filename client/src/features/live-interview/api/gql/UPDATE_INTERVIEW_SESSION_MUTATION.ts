import { gql } from '@urql/solid';

export const UPDATE_INTERVIEW_SESSION_MUTATION = gql`
  mutation UpdateInterviewSession($id: ID!, $finished: Boolean) {
    updateInterviewSession(id: $id, finished: $finished) {
      id
    }
  }
`;
