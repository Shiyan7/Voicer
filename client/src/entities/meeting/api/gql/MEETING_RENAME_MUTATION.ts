import { gql } from '@urql/solid';

export const MEETING_RENAME_MUTATION = gql`
  mutation MeetingRename($id: ID!, $title: String) {
    meetingRename(id: $id, title: $title) {
      id
      title
    }
  }
`;
