import { i18n } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';
import { Tabs } from '@/shared/ui/tabs';

import { actionsStyles } from './Actions.styles';
import { useActionsPage } from './model/useActionsPage';
import { ActionsList } from './segments/actions-list/ui/ActionsList';

const styles = actionsStyles();

export function ActionsOrchestrator() {
  const vm = useActionsPage();

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('actions.title')}</h1>
          <Tabs
            class={styles.tabs()}
            activeTab={vm.filter()}
            tabs={vm.tabs()}
            onSelect={vm.setFilter}
          />
        </header>
        <ActionsList
          items={vm.items()}
          filter={vm.filter()}
          isLoading={vm.isLoading()}
        />
      </div>
    </PageFade>
  );
}
