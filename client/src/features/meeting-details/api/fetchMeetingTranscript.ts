import type {
  QueryMeetingTranscriptArgs,
  TranscriptSegmentOutput,
} from '@schema';
import { Client } from '@urql/solid';

import { MEETING_TRANSCRIPT_QUERY } from './gql/MEETING_TRANSCRIPT_QUERY';

interface MeetingTranscriptQueryResult {
  meetingTranscript: TranscriptSegmentOutput[];
}

export const fetchMeetingTranscript = async (
  client: Client,
  meetingId: string,
): Promise<TranscriptSegmentOutput[]> => {
  const result = await client
    .query<
      MeetingTranscriptQueryResult,
      QueryMeetingTranscriptArgs
    >(MEETING_TRANSCRIPT_QUERY, { meetingId }, { requestPolicy: 'network-only' })
    .toPromise();

  return result.data?.meetingTranscript ?? [];
};
