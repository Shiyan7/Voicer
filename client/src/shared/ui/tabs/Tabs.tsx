import { For } from 'solid-js';

import { tabsStyles } from './Tabs.styles';
import { Tab } from './types';

interface TabsProps<T> {
  class?: string;
  tabs: Tab<T>[];
  activeTab: T;
  size?: 'sm' | 'md';
  onSelect: (value: T) => void;
}

const styles = tabsStyles();

export function Tabs<T>(props: TabsProps<T>) {
  return (
    <ul class={styles.root({ size: props.size, class: props.class })}>
      <For each={props.tabs}>
        {(tab) => (
          <li class={styles.item({ size: props.size })}>
            <button
              class={styles.btn({
                size: props.size,
                active: tab.value === props.activeTab,
              })}
              onClick={() => props.onSelect(tab.value)}
            >
              {tab.label}
            </button>
          </li>
        )}
      </For>
    </ul>
  );
}
