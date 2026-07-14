import { ActionItemGroup } from '../types/ActionItemGroup';
import { ActionsListDeps } from '../types/ActionsListDeps';

export function useActionsList(props: ActionsListDeps) {
  const groups = (): ActionItemGroup[] => [];

  const isLoading = (): boolean => false;

  const isEmpty = (): boolean => true;

  const emptyLabel = (): string => '';

  return { groups, isLoading, isEmpty, emptyLabel };
}
