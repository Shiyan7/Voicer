import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Tab } from '@/shared/ui/tabs';

import { actionItemsQuery } from '../api/actionItemsQuery';
import { mapActionItems } from '../lib/mapActionItems';
import { ActionsFilter } from '../types/ActionsFilter';

export function useActionsPage() {
  const [actionItemsResult] = actionItemsQuery();
  const [filter, setFilter] = createSignal<ActionsFilter>('open');

  const items = () => mapActionItems(actionItemsResult.data?.actionItems);

  const isLoading = (): boolean => actionItemsResult.fetching;

  const tabs = (): Tab<ActionsFilter>[] => [
    { value: 'open', label: i18n.t('actions.filter.open') },
    { value: 'all', label: i18n.t('actions.filter.all') },
  ];

  return { items, isLoading, filter, tabs, setFilter };
}
