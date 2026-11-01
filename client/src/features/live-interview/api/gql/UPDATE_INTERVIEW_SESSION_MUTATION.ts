import { gql } from '@urql/solid';

export const UPDATE_INTERVIEW_SESSION_MUTATION = gql`
  mutation UpdateInterviewSession(
    $id: ID!
    $recordingStartedAt: DateTime
    $finished: Boolean
  ) {
    updateInterviewSession(
      id: $id
      recordingStartedAt: $recordingStartedAt
      finished: $finished
    ) {
      id
    }
  }
`;
