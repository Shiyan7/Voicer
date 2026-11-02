import { gql } from '@urql/solid';

export const INTERVIEW_PREPARATION_QUERY = gql`
  query InterviewPreparation($id: ID!) {
    interviewSession(id: $id) {
      id
      prepStatus
      title
      resumeFileName
      vacancyText
      recommendations {
        topics
        likelyQuestions
        emphasize
      }
    }
  }
`;
