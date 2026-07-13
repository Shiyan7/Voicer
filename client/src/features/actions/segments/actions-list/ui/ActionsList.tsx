import { For, Show } from 'solid-js';

import { useViewModel } from '@/shared/view-model';

import { ActionsListViewModel } from '../model/ActionsListViewModel';
import { ActionsListDeps } from '../types/ActionsListDeps';
import { ActionItemsGroup } from './ActionItemsGroup';
import { actionsListStyles } from './ActionsList.styles';

const styles = actionsListStyles();

export function ActionsList(props: ActionsListDeps) {
  const vm = useViewModel(ActionsListViewModel, () => props);

  return (
    <Show when={!vm.isLoading} fallback={<div class={styles.skeleton()} />}>
      <Show
        when={!vm.isEmpty}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{vm.emptyLabel}</span>
          </div>
        }
      >
        <div class={styles.groups()}>
          <For each={vm.groups}>
            {(group) => <ActionItemsGroup group={group} />}
          </For>
        </div>
      </Show>
    </Show>
  );
}
