import { gql } from '@urql/solid';

export const MEETING_SUGGEST_TITLE_MUTATION = gql`
  mutation MeetingSuggestTitle($id: ID!) {
    meetingSuggestTitle(id: $id)
  }
`;
