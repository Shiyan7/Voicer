import type { ActionItemOutput } from '@schema';

export interface ActionItemsParams {
  items: ActionItemOutput[];
  focusId: string | null;
}
