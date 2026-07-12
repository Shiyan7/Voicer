import { singleton } from '@/shared/di';

import { ActionItem } from '@/entities/meeting';
import { SingletonViewModel } from '@/shared/view-model';

import { ActionItemsService } from './ActionItemsService';

@singleton()
export class ActionItemsViewModel extends SingletonViewModel {
  items: ActionItem[] = [];

  isLoading = false;

  constructor(private readonly actionItemsService: ActionItemsService) {
    super();
  }

  load = async () => {
    this.isLoading = true;

    try {
      this.items = await this.actionItemsService.list();
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
      const updated = await this.actionItemsService.toggle(id, nextIsDone);
      this.patchItem(id, updated);
    } catch (error) {
      this.patchItem(id, { isDone: !nextIsDone });
      throw error;
    }
  };

  updateText = async (id: string, text: string) => {
    const item = this.items.find((it) => it.id === id);
    if (!item) return;

    const prevText = item.text;
    this.patchItem(id, { text });

    try {
      const updated = await this.actionItemsService.updateText(id, text);
      this.patchItem(id, updated);
    } catch (error) {
      this.patchItem(id, { text: prevText });
      throw error;
    }
  };

  remove = async (id: string) => {
    const prev = this.items;
    this.items = this.items.filter((item) => item.id !== id);

    try {
      await this.actionItemsService.remove(id);
    } catch (error) {
      this.items = prev;
      throw error;
    }
  };

  private patchItem(id: string, patch: Partial<ActionItem>) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
  }
}
