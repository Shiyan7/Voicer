import { ToastsViewModel } from '@/entities/toasts';
import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { StatefulViewModel } from '@/shared/view-model';

import { ActionItemsService } from '../api/ActionItemsService';
import { ActionItemRowDeps } from '../types/ActionItemRowDeps';

@injectable()
export class ActionItemViewModel extends StatefulViewModel<ActionItemRowDeps> {
  constructor(
    private readonly actionItems: ActionItemsService,
    private readonly toasts: ToastsViewModel,
  ) {
    super();
  }

  get text() {
    return this.item.text;
  }

  get isDone() {
    return this.item.isDone;
  }

  private get item() {
    return this.deps.item;
  }

  toggle() {
    try {
      void this.actionItems.toggle(this.item.id, !this.isDone);
      this.item.isDone = !this.isDone;
    } catch {
      this.toasts.show('error', i18n.t('actions.update_failed'));
    }
  }
}
