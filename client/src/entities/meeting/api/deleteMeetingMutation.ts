import type { MeetingOutput, MutationMeetingDeleteArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { DELETE_MEETING_MUTATION } from './gql/DELETE_MEETING_MUTATION';

interface DeleteMeetingMutation {
  meetingDelete: Pick<MeetingOutput, 'id'>;
}

export const deleteMeetingMutation = () =>
  createMutation<DeleteMeetingMutation, MutationMeetingDeleteArgs>(
    DELETE_MEETING_MUTATION,
  );
