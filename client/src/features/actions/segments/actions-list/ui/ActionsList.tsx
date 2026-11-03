import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { ActionsListDeps } from '../types/ActionsListDeps';
import { ActionItemsGroup } from './ActionItemsGroup';
import { actionsListStyles } from './ActionsList.styles';

const styles = actionsListStyles();

export function ActionsList(deps: ActionsListDeps) {
  return (
    <Show when={!deps.isLoading} fallback={<div class={styles.skeleton()} />}>
      <Show
        when={!deps.isEmpty}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{i18n.t('actions.empty')}</span>
          </div>
        }
      >
        <div class={styles.groups()}>
          <For each={deps.groups}>
            {(group) => <ActionItemsGroup group={group} />}
          </For>
        </div>
      </Show>
    </Show>
  );
}
