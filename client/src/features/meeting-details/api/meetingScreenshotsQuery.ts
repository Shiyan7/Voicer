import type {
  MeetingScreenshotOutput,
  QueryMeetingScreenshotsArgs,
} from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_SCREENSHOTS_QUERY } from './gql/MEETING_SCREENSHOTS_QUERY';

interface MeetingScreenshotsQueryResult {
  meetingScreenshots: MeetingScreenshotOutput[];
}

type MeetingScreenshotsQueryOptions = Omit<
  CreateQueryArgs<MeetingScreenshotsQueryResult, QueryMeetingScreenshotsArgs>,
  'query' | 'variables'
>;

export const meetingScreenshotsQuery = (
  variables: () => QueryMeetingScreenshotsArgs,
  options?: MeetingScreenshotsQueryOptions,
) =>
  createQuery<MeetingScreenshotsQueryResult, QueryMeetingScreenshotsArgs>({
    query: MEETING_SCREENSHOTS_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
