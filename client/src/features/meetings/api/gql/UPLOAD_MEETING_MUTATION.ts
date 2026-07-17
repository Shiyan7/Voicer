import { gql } from '@urql/solid';

export const UPLOAD_MEETING_MUTATION = gql`
  mutation MeetingUploadAudio($file: Upload!) {
    meetingUploadAudio(file: $file) {
      id
    }
  }
`;
