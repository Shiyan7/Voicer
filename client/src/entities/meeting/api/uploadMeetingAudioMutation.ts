import type { MeetingOutput, MutationMeetingUploadAudioArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_UPLOAD_AUDIO_MUTATION } from './gql/MEETING_UPLOAD_AUDIO_MUTATION';

interface MeetingUploadAudioMutation {
  meetingUploadAudio: Pick<MeetingOutput, 'id'>;
}

export const uploadMeetingAudioMutation = () =>
  createMutation<MeetingUploadAudioMutation, MutationMeetingUploadAudioArgs>(
    MEETING_UPLOAD_AUDIO_MUTATION,
  );
