import { gql } from '@urql/solid';

export const INTERVIEW_SESSION_QUERY = gql`
  query InterviewSession($id: ID!) {
    interviewSession(id: $id) {
      id
      title
      finishedAt
      meetingId
      recordingUrl
      createdAt
    }
  }
`;
