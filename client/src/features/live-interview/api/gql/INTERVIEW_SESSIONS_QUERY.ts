import { gql } from '@urql/solid';

export const INTERVIEW_SESSIONS_QUERY = gql`
  query InterviewSessions {
    interviewSessions {
      id
      vacancyText
      finishedAt
      meetingId
      createdAt
    }
  }
`;
