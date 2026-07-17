import { ActionItemData } from '@/entities/action-item';
import { meetingActionItemsQuery } from '@/features/meeting-details/api/meetingActionItemsQuery';
import { mapActionItem } from '@/features/meeting-details/lib/mapActionItem';

import { ActionItemsParams } from '../types/ActionItemsParams';

export function useActionItems(props: ActionItemsParams) {
  const [result] = meetingActionItemsQuery({ meetingId: props.meetingId });

  const items = (): ActionItemData[] =>
    (result.data?.meetingActionItems ?? []).map(mapActionItem);

  const isEmpty = () => !result.fetching && items().length === 0;

  return { items, isEmpty };
}
