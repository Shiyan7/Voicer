import type { MutationToggleActionItemArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { TOGGLE_ACTION_ITEM_MUTATION } from './gql/TOGGLE_ACTION_ITEM_MUTATION';

interface ToggleActionItemMutation {
  toggleActionItem: boolean;
}

export const toggleActionItemMutation = () =>
  createMutation<ToggleActionItemMutation, MutationToggleActionItemArgs>(
    TOGGLE_ACTION_ITEM_MUTATION,
  );
