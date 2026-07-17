import { actionItemsQuery } from '../api/actionItemsQuery';
import { groupActionItems } from '../lib/groupActionItems';
import { mapActionItems } from '../lib/mapActionItems';

export const useActionsPage = () => {
  const [actionItemsResult] = actionItemsQuery();

  const items = () => mapActionItems(actionItemsResult.data?.actionItems);

  const groups = () => groupActionItems(items());

  const isLoading = () => actionItemsResult.fetching;

  const isEmpty = () => !isLoading() && !items().length;

  return { groups, isLoading, isEmpty };
};
