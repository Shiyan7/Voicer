import { injectable } from 'tsyringe';

import { ActionItem } from '@/entities/meeting';
import { StatefulViewModel } from '@/shared/view-model';

import { ActionItemsService } from './ActionItemsService';

@injectable()
export class ActionItemsViewModel extends StatefulViewModel {
  items: ActionItem[] = [];
  isLoading = false;

  constructor(private readonly actionItems: ActionItemsService) {
    super();
  }

  load = async () => {
    this.isLoading = true;

    try {
      this.items = await this.actionItems.get();
    } finally {
      this.isLoading = false;
    }
  };

  toggleDone = async (id: string) => {
    const item = this.items.find((it) => it.id === id);
    if (!item) return;

    const nextIsDone = !item.isDone;
    this.patchItem(id, { isDone: nextIsDone });

    try {
      const updated = await this.actionItems.toggle(id, nextIsDone);
      this.patchItem(id, updated);
    } catch (error) {
      this.patchItem(id, { isDone: !nextIsDone });
      throw error;
    }
  };

  private patchItem(id: string, patch: Partial<ActionItem>) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
  }
}
