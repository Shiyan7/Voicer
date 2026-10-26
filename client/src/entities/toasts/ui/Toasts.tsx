import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useToasts } from '@/entities/toasts';
import { Icon } from '@/shared/ui/icon';

import { TOAST_ICONS } from '../config/toastIcons';
import { toastsStyles } from './Toasts.styles';

const styles = toastsStyles();

export function Toasts() {
  const toasts = useToasts();

  return (
    <Portal>
      <div class={styles.root()}>
        <For each={toasts.items()}>
          {(toast) => (
            <div class={styles.toast({ variant: toast.type })}>
              <span class={styles.badge({ variant: toast.type })}>
                <Icon size={14} name={TOAST_ICONS[toast.type]} />
              </span>
              <span class={styles.title()}>{toast.title}</span>
              <button
                class={styles.close()}
                onClick={() => toasts.remove(toast.id)}
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
