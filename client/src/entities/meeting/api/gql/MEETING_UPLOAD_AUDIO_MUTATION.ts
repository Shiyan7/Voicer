import { gql } from '@urql/solid';

export const MEETING_UPLOAD_AUDIO_MUTATION = gql`
  mutation MeetingUploadAudio(
    $file: Upload!
    $source: String
    $startedAt: DateTime
  ) {
    meetingUploadAudio(file: $file, source: $source, startedAt: $startedAt) {
      id
    }
  }
`;
