import { For, Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';

import { SearchResultItemProps } from '../types/SearchResultItemProps';
import { searchResultItemStyles } from './SearchResultItem.styles';

const styles = searchResultItemStyles();

export function SearchResultItem(props: SearchResultItemProps) {
  return (
    <button
      class={styles.root({ active: props.result.isActive })}
      type="button"
      onClick={() => props.onSelect(props.result.href)}
      onMouseMove={props.onHover}
    >
      <Icon class={styles.icon()} size={20} name={props.result.icon} />
      <span class={styles.body()}>
        <span class={styles.title()}>{props.result.title}</span>
        <span class={styles.snippet()}>
          <For each={props.result.snippet}>
            {(part) => (
              <Show when={part.isMatch} fallback={part.text}>
                <mark class={styles.match()}>{part.text}</mark>
              </Show>
            )}
          </For>
        </span>
      </span>
      <span class={styles.date()}>{props.result.dateLabel}</span>
    </button>
  );
}
