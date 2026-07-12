import { For } from 'solid-js';

import { tabsStyles } from './Tabs.styles';
import { Tab } from './types';

interface TabsProps<T> {
  class?: string;
  tabs: Tab<T>[];
  activeTab: T;
  onSelect: (value: T) => void;
}

const styles = tabsStyles();

export function Tabs<T>(props: TabsProps<T>) {
  return (
    <ul class={styles.root({ class: props.class })}>
      <For each={props.tabs}>
        {(tab) => (
          <li class={styles.item()}>
            <button
              class={styles.btn({ active: tab.value === props.activeTab })}
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
