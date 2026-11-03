import { Show } from 'solid-js';

import { revealWhen } from '@/shared/lib/dom';
import { Icon } from '@/shared/ui/icon';

import { useActionItem } from '../model/useActionItem';
import { ActionItemDeps } from '../types/ActionItemDeps';
import { actionItemStyles } from './ActionItem.styles';

const styles = actionItemStyles();

export function ActionItem(deps: ActionItemDeps) {
  const vm = useActionItem(deps);

  return (
    <div
      class={styles.row({ focused: deps.item.isFocused })}
      ref={revealWhen(deps.item.isFocused)}
    >
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
      <p class={styles.text({ done: vm.isDone() })}>
        <Show when={deps.item.speakerLabel}>
          {(label) => (
            <span class={styles.mention({ tone: deps.item.speakerTone })}>
              @{label()}
            </span>
          )}
        </Show>
        {deps.item.text}
        <Show when={deps.item.timeLabel}>
          {(time) => <span class={styles.time()}>{time()}</span>}
        </Show>
      </p>
    </div>
  );
}
