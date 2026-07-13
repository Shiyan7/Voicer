import { ApiService } from '@/shared/api';
import { injectable } from '@/shared/di';

import { ActionItemData } from '../types/ActionItemData';

@injectable()
export class ActionItemsService {
  constructor(private readonly api: ApiService) {}

  get() {
    return this.api.get<ActionItemData[]>('/action-items');
  }

  toggle(item: ActionItemData) {
    return this.api.patch<ActionItemData>(`/action-items/${item.id}`, {
      isDone: !item.isDone,
    });
  }
}
