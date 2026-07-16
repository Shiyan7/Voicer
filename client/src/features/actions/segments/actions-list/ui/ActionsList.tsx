import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { ActionsListDeps } from '../types/ActionsListDeps';
import { ActionItemsGroup } from './ActionItemsGroup';
import { actionsListStyles } from './ActionsList.styles';

const styles = actionsListStyles();

export function ActionsList(props: ActionsListDeps) {
  return (
    <Show when={!props.isLoading} fallback={<div class={styles.skeleton()} />}>
      <Show
        when={!props.isEmpty}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{i18n.t('actions.empty')}</span>
          </div>
        }
      >
        <div class={styles.groups()}>
          <For each={props.groups}>
            {(group) => <ActionItemsGroup group={group} />}
          </For>
        </div>
      </Show>
    </Show>
  );
}
