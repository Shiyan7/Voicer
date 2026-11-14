import type {
  MeetingScreenshotOutput,
  MutationMeetingAddScreenshotArgs,
} from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { MEETING_ADD_SCREENSHOT_MUTATION } from './gql/MEETING_ADD_SCREENSHOT_MUTATION';

interface MeetingAddScreenshotMutation {
  meetingAddScreenshot: Pick<MeetingScreenshotOutput, 'id'>;
}

export const addMeetingScreenshot = async (
  variables: MutationMeetingAddScreenshotArgs,
) => {
  const result = await urqlClient
    .mutation<
      MeetingAddScreenshotMutation,
      MutationMeetingAddScreenshotArgs
    >(MEETING_ADD_SCREENSHOT_MUTATION, variables)
    .toPromise();
  if (result.error) throw result.error;
};
