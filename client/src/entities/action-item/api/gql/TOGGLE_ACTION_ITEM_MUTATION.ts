import { gql } from '@urql/solid';

export const TOGGLE_ACTION_ITEM_MUTATION = gql`
  mutation ToggleActionItem($id: ID!) {
    toggleActionItem(id: $id)
  }
`;
