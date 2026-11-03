import { createSignal } from 'solid-js';

import { toggleActionItemMutation } from '../api/toggleActionItemMutation';
import { ActionItemDeps } from '../types/ActionItemDeps';

export const useActionItem = (deps: ActionItemDeps) => {
  const [isDone, setIsDone] = createSignal(deps.item.isDone);
  const [, toggleActionItem] = toggleActionItemMutation();

  const toggle = async () => {
    setIsDone((prev) => !prev);

    const result = await toggleActionItem({ id: deps.item.id });

    if (result.error) {
      setIsDone((prev) => !prev);
    }
  };

  return { isDone, toggle };
};
