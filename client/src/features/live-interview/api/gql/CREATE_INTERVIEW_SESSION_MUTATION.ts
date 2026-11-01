import { gql } from '@urql/solid';

export const CREATE_INTERVIEW_SESSION_MUTATION = gql`
  mutation CreateInterviewSession($resume: Upload!, $vacancy: String!) {
    createInterviewSession(resume: $resume, vacancy: $vacancy) {
      id
      recommendations {
        topics
        likelyQuestions
        emphasize
      }
    }
  }
`;
