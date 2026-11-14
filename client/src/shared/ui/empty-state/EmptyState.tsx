import { Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';

import { EMPTY_STATE_ILLUSTRATIONS } from './config/EMPTY_STATE_ILLUSTRATIONS';
import { emptyStateStyles } from './EmptyState.styles';
import { EmptyStateProps } from './types/EmptyStateProps';

const styles = emptyStateStyles();

export function EmptyState(props: EmptyStateProps) {
  return (
    <section class={styles.root({ tone: props.tone })}>
      <div class={styles.glow()} />
      <div class={styles.stack()}>
        <img
          class={styles.illustration()}
          src={EMPTY_STATE_ILLUSTRATIONS[props.illustration]}
          alt=""
        />
        <span class={styles.badge()}>
          <Icon size={20} name={props.icon} />
        </span>
      </div>
      <h2 class={styles.title()}>{props.title}</h2>
      <p class={styles.description()}>{props.description}</p>
      <Show when={props.hint}>
        <span class={styles.hint()}>
          <Show when={props.hintIcon}>
            {(hintIcon) => <Icon size={14} name={hintIcon()} />}
          </Show>
          {props.hint}
        </span>
      </Show>
    </section>
  );
}
