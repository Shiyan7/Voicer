import { i18n } from '@/shared/i18n';

import { groupActionItems } from '../lib/groupActionItems';
import { ActionItemGroup } from '../types/ActionItemGroup';
import { ActionsListDeps } from '../types/ActionsListDeps';

export function useActionsList(props: ActionsListDeps) {
  const visibleItems = () =>
    props.filter === 'open'
      ? props.items.filter((item) => !item.isDone)
      : props.items;

  const groups = (): ActionItemGroup[] => groupActionItems(visibleItems());

  const isLoading = (): boolean => props.isLoading;

  const isEmpty = (): boolean => !visibleItems().length;

  const emptyLabel = () =>
    props.filter === 'open'
      ? i18n.t('actions.empty_open')
      : i18n.t('actions.empty');

  return { groups, isLoading, isEmpty, emptyLabel };
}
