import { i18n } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';

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
        </header>
        <ActionsList
          groups={vm.groups()}
          isEmpty={vm.isEmpty()}
          isLoading={vm.isLoading()}
        />
      </div>
    </PageFade>
  );
}
