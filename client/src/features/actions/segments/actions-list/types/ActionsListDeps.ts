import { ActionItemGroup } from '../../../types/ActionItemGroup';

export interface ActionsListDeps {
  groups: ActionItemGroup[];
  isEmpty: boolean;
  isLoading: boolean;
}
