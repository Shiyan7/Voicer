import { gql } from '@urql/solid';

export const MEETING_UPLOAD_AUDIO_MUTATION = gql`
  mutation MeetingUploadAudio($file: Upload!) {
    meetingUploadAudio(file: $file) {
      id
    }
  }
`;
