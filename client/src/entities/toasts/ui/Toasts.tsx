import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { ToastsViewModel } from '@/entities/toasts';
import { Icon } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { toastsStyles } from './Toasts.styles';

const styles = toastsStyles();

export function Toasts() {
  const model = useViewModel(ToastsViewModel);

  return (
    <Portal>
      <div class={styles.root()}>
        <For each={model.items}>
          {(toast) => (
            <div class={styles.toast({ variant: toast.type })}>
              <div class={styles.left()}>
                <span class={styles.title()}>{toast.title}</span>
              </div>
              <button
                class={styles.close()}
                onClick={() => model.remove(toast.id)}
                aria-label="Close toast"
              >
                <Icon size={16} name="common:cross" />
              </button>
            </div>
          )}
        </For>
      </div>
    </Portal>
  );
}
