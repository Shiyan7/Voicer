import type { ActionItemOutput } from '@schema';

export interface ActionItemsDeps {
  items: ActionItemOutput[];
  focusId: string | null;
}
