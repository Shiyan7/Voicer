import { For } from 'solid-js';

import { tabsStyles } from './Tabs.styles';
import { Tab } from './types';

interface TabsProps {
  class?: string;
  tabs: Tab[];
  activeTab: string;
  onSelect: (value: string) => void;
}

const styles = tabsStyles();

export function Tabs(props: TabsProps) {
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
