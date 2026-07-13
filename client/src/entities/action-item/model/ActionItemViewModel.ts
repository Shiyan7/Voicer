import { ToastsViewModel } from '@/entities/toasts';
import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { StatefulViewModel } from '@/shared/view-model';

import { ActionItemsService } from '../api/ActionItemsService';
import { ActionItemDeps } from '../types/ActionItemDeps';

@injectable()
export class ActionItemViewModel extends StatefulViewModel<ActionItemDeps> {
  constructor(
    private readonly actionItems: ActionItemsService,
    private readonly toasts: ToastsViewModel,
  ) {
    super();
  }

  get item() {
    return this.deps.item;
  }

  async toggle() {
    try {
      await this.actionItems.toggle(this.item);
      this.item.isDone = !this.item.isDone;
    } catch (e) {
      this.toasts.show('error', i18n.t('actions.update_failed'));
    }
  }
}
