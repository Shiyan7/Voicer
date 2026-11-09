import type {
  MutationMeetingTranscriptUpdateArgs,
  TranscriptSegmentOutput,
} from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_TRANSCRIPT_UPDATE_MUTATION } from './gql/MEETING_TRANSCRIPT_UPDATE_MUTATION';

interface MeetingTranscriptUpdateMutation {
  meetingTranscriptUpdate: TranscriptSegmentOutput[];
}

export const meetingTranscriptUpdateMutation = () =>
  createMutation<
    MeetingTranscriptUpdateMutation,
    MutationMeetingTranscriptUpdateArgs
  >(MEETING_TRANSCRIPT_UPDATE_MUTATION);
