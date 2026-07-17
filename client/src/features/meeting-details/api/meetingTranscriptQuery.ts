import type {
  QueryMeetingTranscriptArgs,
  TranscriptSegmentOutput,
} from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETING_TRANSCRIPT_QUERY } from './gql/MEETING_TRANSCRIPT_QUERY';

interface MeetingTranscriptQueryResult {
  meetingTranscript: TranscriptSegmentOutput[];
}

type MeetingTranscriptQueryOptions = Omit<
  CreateQueryArgs<MeetingTranscriptQueryResult, QueryMeetingTranscriptArgs>,
  'query' | 'variables'
>;

export const meetingTranscriptQuery = (
  variables: QueryMeetingTranscriptArgs,
  options?: MeetingTranscriptQueryOptions,
) =>
  createQuery<MeetingTranscriptQueryResult, QueryMeetingTranscriptArgs>({
    query: MEETING_TRANSCRIPT_QUERY,
    variables,
    requestPolicy: 'network-only',
    ...options,
  });
