import { gql } from '@urql/solid';

export const CREATE_INTERVIEW_SESSION_MUTATION = gql`
  mutation CreateInterviewSession(
    $resume: Upload
    $resumeSessionId: ID
    $vacancy: String!
    $language: InterviewLanguage!
  ) {
    createInterviewSession(
      resume: $resume
      resumeSessionId: $resumeSessionId
      vacancy: $vacancy
      language: $language
    ) {
      id
    }
  }
`;
