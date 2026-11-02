import { gql } from '@urql/solid';

export const INTERVIEW_RESUMES_QUERY = gql`
  query InterviewResumes {
    interviewResumes {
      sessionId
      fileName
    }
  }
`;
