import { gql } from '@urql/solid';

export const RETRY_INTERVIEW_PREPARATION_MUTATION = gql`
  mutation RetryInterviewPreparation($id: ID!) {
    retryInterviewPreparation(id: $id) {
      id
      prepStatus
    }
  }
`;
