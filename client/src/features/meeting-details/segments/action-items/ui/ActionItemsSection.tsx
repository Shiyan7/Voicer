import { For, Show } from 'solid-js';

import { ActionItem } from '@/entities/action-item';
import { i18n } from '@/shared/i18n';

import { useActionItems } from '../model/useActionItems';
import { ActionItemsParams } from '../types/ActionItemsParams';
import { actionItemsSectionStyles } from './ActionItemsSection.styles';

const styles = actionItemsSectionStyles();

export function ActionItemsSection(props: ActionItemsParams) {
  const vm = useActionItems(props);

  return (
    <Show when={!vm.isEmpty()}>
      <section class={styles.card()}>
        <h2 class={styles.sectionTitle()}>{i18n.t('meetings.action_items')}</h2>
        <For each={vm.items()}>{(item) => <ActionItem item={item} />}</For>
      </section>
    </Show>
  );
}
