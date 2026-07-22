import type { MeetingOutput, SubscriptionMeetingUpdatedArgs } from '@schema';
import { createSubscription, CreateSubscriptionArgs } from '@urql/solid';
import { Accessor } from 'solid-js';

import { MEETING_UPDATED_SUBSCRIPTION } from './gql/MEETING_UPDATED_SUBSCRIPTION';

interface MeetingUpdatedResult {
  meetingUpdated: MeetingOutput;
}

type MeetingUpdatedSubscriptionOptions = Omit<
  CreateSubscriptionArgs<MeetingUpdatedResult, SubscriptionMeetingUpdatedArgs>,
  'query' | 'variables'
>;

export const meetingUpdatedSubscription = (
  variables: Accessor<SubscriptionMeetingUpdatedArgs>,
  options?: MeetingUpdatedSubscriptionOptions,
) =>
  createSubscription<MeetingUpdatedResult>({
    query: MEETING_UPDATED_SUBSCRIPTION,
    variables,
    ...options,
  });
