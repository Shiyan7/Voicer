import type { MeetingOutput, MutationMeetingSummarizeArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_SUMMARIZE_MUTATION } from './gql/MEETING_SUMMARIZE_MUTATION';

interface MeetingSummarizeMutation {
  meetingSummarize: Pick<MeetingOutput, 'id' | 'status'>;
}

export const meetingSummarizeMutation = () =>
  createMutation<MeetingSummarizeMutation, MutationMeetingSummarizeArgs>(
    MEETING_SUMMARIZE_MUTATION,
  );
