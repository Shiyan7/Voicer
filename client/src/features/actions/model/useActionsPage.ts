import { ActionItemData } from '@/entities/action-item';
import { Tab } from '@/shared/ui/tabs';

import { ActionsFilter } from '../types/ActionsFilter';

export function useActionsPage() {
  const items = (): ActionItemData[] => [];

  const isLoading = (): boolean => false;

  const filter = (): ActionsFilter => 'open';

  const tabs = (): Tab<ActionsFilter>[] => [];

  const setFilter = (value: ActionsFilter) => {};

  return { items, isLoading, filter, tabs, setFilter };
}
