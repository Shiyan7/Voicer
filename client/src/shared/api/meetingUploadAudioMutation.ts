import type { MeetingOutput } from '@schema';
import { gql } from '@urql/solid';

export interface MeetingUploadAudioMutation {
  meetingUploadAudio: Pick<MeetingOutput, 'id'>;
}

export const MEETING_UPLOAD_AUDIO_MUTATION = gql`
  mutation MeetingUploadAudio($file: Upload!) {
    meetingUploadAudio(file: $file) {
      id
    }
  }
`;
