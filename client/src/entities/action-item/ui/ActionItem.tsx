import { Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { ActionItemViewModel } from '../model/ActionItemViewModel';
import { ActionItemData } from '../types/ActionItemData';
import { actionItemStyles } from './ActionItem.styles';

interface ActionItemRowProps {
  item: ActionItemData;
  class?: string;
}

const styles = actionItemStyles();

export function ActionItem(props: ActionItemRowProps) {
  const vm = useViewModel(ActionItemViewModel, () => ({ item: props.item }));

  return (
    <div class={styles.row({ class: props.class })}>
      <button
        class={styles.checkbox({ done: vm.isDone })}
        aria-pressed={vm.isDone}
        type="button"
        onClick={() => vm.toggle()}
      >
        <Show when={vm.isDone}>
          <Icon size={11} name="common:check" />
        </Show>
      </button>
      <span class={styles.text({ done: vm.isDone })}>{vm.text}</span>
    </div>
  );
}
