import { gql } from '@urql/solid';

export const INTERVIEW_ASK_SCREENSHOT_MUTATION = gql`
  mutation InterviewAskScreenshot($sessionId: ID!, $image: Upload!) {
    interviewAskScreenshot(sessionId: $sessionId, image: $image)
  }
`;
