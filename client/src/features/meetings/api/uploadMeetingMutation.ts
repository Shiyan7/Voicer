import type { MeetingOutput, MutationMeetingUploadAudioArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { UPLOAD_MEETING_MUTATION } from './gql/UPLOAD_MEETING_MUTATION';

interface UploadMeetingMutation {
  meetingUploadAudio: Pick<MeetingOutput, 'id'>;
}

export const uploadMeetingMutation = () =>
  createMutation<UploadMeetingMutation, MutationMeetingUploadAudioArgs>(
    UPLOAD_MEETING_MUTATION,
  );
