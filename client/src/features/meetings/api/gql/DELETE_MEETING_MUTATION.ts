import { gql } from '@urql/solid';

export const DELETE_MEETING_MUTATION = gql`
  mutation MeetingDelete($id: ID!) {
    meetingDelete(id: $id) {
      id
    }
  }
`;
