import { ActionItemGroup } from '@/features/actions/types/ActionItemGroup';

export interface ActionsListDeps {
  groups: ActionItemGroup[];
  isEmpty: boolean;
  isLoading: boolean;
}
