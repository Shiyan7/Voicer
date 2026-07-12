import { ActionItem } from '@/entities/meeting';
import { ApiService } from '@/shared/api';
import { injectable } from '@/shared/di';

@injectable()
export class ActionItemsService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.get<ActionItem[]>('/action-items');
  }

  toggle(id: string, isDone: boolean) {
    return this.api.patch<ActionItem>(`/action-items/${id}`, { isDone });
  }

  updateText(id: string, text: string) {
    return this.api.patch<ActionItem>(`/action-items/${id}`, { text });
  }

  remove(id: string) {
    return this.api.delete<void>(`/action-items/${id}`);
  }
}
