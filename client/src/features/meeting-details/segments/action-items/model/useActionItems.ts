import { mapActionItem } from '../../../lib/mapActionItem';
import { ActionItemsParams } from '../types/ActionItemsParams';

export const useActionItems = (props: ActionItemsParams) => {
  const items = () =>
    props.items.map((item) => mapActionItem(item, props.focusId));

  const isEmpty = () => items().length === 0;

  return { items, isEmpty };
};
