import { actionItemsQuery } from '../api/actionItemsQuery';
import { groupActionItems } from '../lib/groupActionItems';
import { mapActionItems } from '../lib/mapActionItems';

export function useActionsPage() {
  const [actionItemsResult] = actionItemsQuery();

  const items = () => mapActionItems(actionItemsResult.data?.actionItems);

  const groups = () => groupActionItems(items());

  const isLoading = (): boolean => actionItemsResult.fetching;

  const isEmpty = (): boolean => !isLoading() && !items().length;

  return { groups, isLoading, isEmpty };
}
