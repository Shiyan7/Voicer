import { mapActionItem } from '@/features/meeting-details/lib/mapActionItem';

import { ActionItemsParams } from '../types/ActionItemsParams';

export const useActionItems = (props: ActionItemsParams) => {
  const items = () => props.items.map(mapActionItem);

  const isEmpty = () => items().length === 0;

  return { items, isEmpty };
};
