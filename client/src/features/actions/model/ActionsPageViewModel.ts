import { injectable } from 'tsyringe';

import { ActionItemData, ActionItemsService } from '@/entities/action-item';
import { i18n } from '@/shared/i18n';
import { Tab } from '@/shared/ui/tabs';
import { StatefulViewModel } from '@/shared/view-model';

import { ActionsFilter } from '../types/ActionsFilter';

@injectable()
export class ActionsPageViewModel extends StatefulViewModel {
  items: ActionItemData[] = [];
  isLoading = false;
  filter: ActionsFilter = 'open';

  constructor(private readonly actionItems: ActionItemsService) {
    super();
  }

  get tabs(): Tab<ActionsFilter>[] {
    return [
      { value: 'open', label: i18n.t('actions.filter.open') },
      { value: 'all', label: i18n.t('actions.filter.all') },
    ];
  }

  setFilter = (value: ActionsFilter) => {
    this.filter = value;
  };

  protected onMount() {
    void this.load();
  }

  private load = async () => {
    this.isLoading = true;

    try {
      this.items = await this.actionItems.get();
    } finally {
      this.isLoading = false;
    }
  };
}
