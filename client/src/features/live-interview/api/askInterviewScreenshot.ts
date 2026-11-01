import type { MutationInterviewAskScreenshotArgs } from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { INTERVIEW_ASK_SCREENSHOT_MUTATION } from './gql/INTERVIEW_ASK_SCREENSHOT_MUTATION';

interface InterviewAskScreenshotMutation {
  interviewAskScreenshot: string;
}

export const askInterviewScreenshot = async (
  variables: MutationInterviewAskScreenshotArgs,
) => {
  const result = await urqlClient
    .mutation<
      InterviewAskScreenshotMutation,
      MutationInterviewAskScreenshotArgs
    >(INTERVIEW_ASK_SCREENSHOT_MUTATION, variables)
    .toPromise();
  if (result.error) throw result.error;
  return result.data?.interviewAskScreenshot;
};
