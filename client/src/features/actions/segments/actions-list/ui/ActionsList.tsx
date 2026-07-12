import { For, Show } from 'solid-js';

import { ActionItemGroup } from '@/features/actions/types/ActionItemGroup';

import { ActionItemsGroup } from './ActionItemsGroup';
import { actionsListStyles } from './ActionsList.styles';

interface ActionsListProps {
  isLoading: boolean;
  groups: ActionItemGroup[];
  emptyLabel?: string;
  onItemToggle: (id: string) => void;
}

const styles = actionsListStyles();

export function ActionsList(props: ActionsListProps) {
  return (
    <Show when={!props.isLoading} fallback={<div class={styles.skeleton()} />}>
      <Show
        when={props.groups.length > 0}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{props.emptyLabel}</span>
          </div>
        }
      >
        <div class={styles.groups()}>
          <For each={props.groups}>
            {(group) => (
              <ActionItemsGroup group={group} onToggle={props.onItemToggle} />
            )}
          </For>
        </div>
      </Show>
    </Show>
  );
}
