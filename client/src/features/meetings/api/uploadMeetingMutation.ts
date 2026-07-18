import type { MutationMeetingUploadAudioArgs } from '@schema';
import { createMutation } from '@urql/solid';

import {
  MEETING_UPLOAD_AUDIO_MUTATION,
  type MeetingUploadAudioMutation,
} from '@/shared/api';

export const uploadMeetingMutation = () =>
  createMutation<MeetingUploadAudioMutation, MutationMeetingUploadAudioArgs>(
    MEETING_UPLOAD_AUDIO_MUTATION,
  );
