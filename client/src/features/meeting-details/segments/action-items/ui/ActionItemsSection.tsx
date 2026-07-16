import { For, Show } from 'solid-js';

import { ActionItem } from '@/entities/action-item';
import { i18n } from '@/shared/i18n';

import { ActionItemsParams } from '../types/ActionItemsParams';
import { actionItemsSectionStyles } from './ActionItemsSection.styles';

const styles = actionItemsSectionStyles();

export function ActionItemsSection(props: ActionItemsParams) {
  return (
    <Show when={props.items.length}>
      <section class={styles.card()}>
        <h2 class={styles.sectionTitle()}>{i18n.t('meetings.action_items')}</h2>
        <For each={props.items}>{(item) => <ActionItem item={item} />}</For>
      </section>
    </Show>
  );
}
