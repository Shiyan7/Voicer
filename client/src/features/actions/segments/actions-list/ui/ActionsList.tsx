import { For, Show } from 'solid-js';

import { useActionsList } from '../model/useActionsList';
import { ActionsListDeps } from '../types/ActionsListDeps';
import { ActionItemsGroup } from './ActionItemsGroup';
import { actionsListStyles } from './ActionsList.styles';

const styles = actionsListStyles();

export function ActionsList(props: ActionsListDeps) {
  const vm = useActionsList(props);

  return (
    <Show when={!vm.isLoading()} fallback={<div class={styles.skeleton()} />}>
      <Show
        when={!vm.isEmpty()}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{vm.emptyLabel()}</span>
          </div>
        }
      >
        <div class={styles.groups()}>
          <For each={vm.groups()}>
            {(group) => <ActionItemsGroup group={group} />}
          </For>
        </div>
      </Show>
    </Show>
  );
}
