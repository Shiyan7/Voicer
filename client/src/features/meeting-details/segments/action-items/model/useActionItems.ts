import { mapActionItem } from '../../../lib/mapActionItem';
import { ActionItemsDeps } from '../types/ActionItemsDeps';

export const useActionItems = (deps: ActionItemsDeps) => {
  const items = () =>
    deps.items.map((item) => mapActionItem(item, deps.focusId));

  const isEmpty = () => items().length === 0;

  return { items, isEmpty };
};
