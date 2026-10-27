import type { MeetingOutput, MutationMeetingRenameArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_RENAME_MUTATION } from './gql/MEETING_RENAME_MUTATION';

interface RenameMeetingMutation {
  meetingRename: Pick<MeetingOutput, 'id' | 'title'>;
}

export const renameMeetingMutation = () =>
  createMutation<RenameMeetingMutation, MutationMeetingRenameArgs>(
    MEETING_RENAME_MUTATION,
  );
