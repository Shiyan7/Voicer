import { Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';

import { useActionItem } from '../model/useActionItem';
import { ActionItemDeps } from '../types/ActionItemDeps';
import { actionItemStyles } from './ActionItem.styles';

const styles = actionItemStyles();

export function ActionItem(props: ActionItemDeps) {
  const vm = useActionItem(() => props.item.isDone);

  return (
    <div class={styles.row()}>
      <button
        class={styles.checkbox({ done: vm.isDone() })}
        aria-pressed={vm.isDone()}
        type="button"
        onClick={() => vm.toggle()}
      >
        <Show when={vm.isDone()}>
          <Icon size={12} name="common:check" />
        </Show>
      </button>
      <span class={styles.text({ done: vm.isDone() })}>{props.item.text}</span>
    </div>
  );
}
