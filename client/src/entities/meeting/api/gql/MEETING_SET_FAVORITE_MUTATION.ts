import { gql } from '@urql/solid';

export const MEETING_SET_FAVORITE_MUTATION = gql`
  mutation MeetingSetFavorite($id: ID!, $isFavorite: Boolean!) {
    meetingSetFavorite(id: $id, isFavorite: $isFavorite) {
      id
      isFavorite
    }
  }
`;
