import { gql } from '@urql/solid';

export const CREATE_INTERVIEW_SESSION_MUTATION = gql`
  mutation CreateInterviewSession(
    $resume: Upload!
    $vacancy: String!
    $language: InterviewLanguage!
  ) {
    createInterviewSession(
      resume: $resume
      vacancy: $vacancy
      language: $language
    ) {
      id
      recommendations {
        topics
        likelyQuestions
        emphasize
      }
    }
  }
`;
