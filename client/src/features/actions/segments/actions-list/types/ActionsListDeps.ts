import { ActionItemData } from '@/entities/action-item';
import { ActionsFilter } from '@/features/actions/types/ActionsFilter';

export interface ActionsListDeps {
  items: ActionItemData[];
  filter: ActionsFilter;
  isLoading: boolean;
}
