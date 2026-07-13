import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { StatusBadge } from '@/shared/ui/status-badge';

import { StatePanelDeps } from '../types/StatePanelDeps';
import { statePanelStyles } from './StatePanel.styles';

const styles = statePanelStyles();

export function StatePanel(props: StatePanelDeps) {
  const isProcessing = () => props.variant === 'processing';

  return (
    <div class={styles.panel()}>
      <Show when={isProcessing()}>
        <div class={styles.spinner()} />
      </Show>
      <StatusBadge status={props.status} />
      <p class={styles.hint()}>
        {isProcessing()
          ? i18n.t('meetings.processing_hint')
          : i18n.t('meetings.failed_hint')}
      </p>
    </div>
  );
}
