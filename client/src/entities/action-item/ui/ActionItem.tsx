import { Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { ActionItemViewModel } from '../model/ActionItemViewModel';
import { ActionItemDeps } from '../types/ActionItemDeps';
import { actionItemStyles } from './ActionItem.styles';

const styles = actionItemStyles();

export function ActionItem(props: ActionItemDeps) {
  const vm = useViewModel(ActionItemViewModel, () => props);

  return (
    <div class={styles.row()}>
      <button
        class={styles.checkbox({ done: vm.item.isDone })}
        aria-pressed={vm.item.isDone}
        type="button"
        onClick={() => vm.toggle()}
      >
        <Show when={vm.item.isDone}>
          <Icon size={12} name="common:check" />
        </Show>
      </button>
      <span class={styles.text({ done: vm.item.isDone })}>{vm.item.text}</span>
    </div>
  );
}
