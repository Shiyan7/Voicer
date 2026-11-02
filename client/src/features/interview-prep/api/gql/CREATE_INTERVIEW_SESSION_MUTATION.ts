import { gql } from '@urql/solid';

export const CREATE_INTERVIEW_SESSION_MUTATION = gql`
  mutation CreateInterviewSession(
    $resume: Upload!
    $vacancy: String!
    $language: InterviewLanguage!
    $mode: InterviewMode!
  ) {
    createInterviewSession(
      resume: $resume
      vacancy: $vacancy
      language: $language
      mode: $mode
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
