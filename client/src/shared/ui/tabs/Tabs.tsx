import { createEffect, createSignal, For, onCleanup, onMount } from 'solid-js';

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
  let rootRef!: HTMLUListElement;
  const [indicatorStyle, setIndicatorStyle] = createSignal({});
  const [isAnimated, setIsAnimated] = createSignal(false);

  const moveIndicator = () => {
    const activeItem = rootRef.querySelector<HTMLElement>('[data-active]');

    setIndicatorStyle({
      width: `${activeItem?.offsetWidth ?? 0}px`,
      height: `${activeItem?.offsetHeight ?? 0}px`,
      transform: `translate(${activeItem?.offsetLeft ?? 0}px, ${activeItem?.offsetTop ?? 0}px)`,
    });
  };

  createEffect(() => {
    props.tabs;
    props.activeTab;
    moveIndicator();
  });

  onMount(() => {
    const observer = new ResizeObserver(moveIndicator);
    observer.observe(rootRef);
    const frame = requestAnimationFrame(() => setIsAnimated(true));

    onCleanup(() => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    });
  });

  return (
    <ul
      ref={rootRef}
      class={styles.root({ size: props.size, class: props.class })}
    >
      <li
        aria-hidden="true"
        class={styles.indicator({ size: props.size, animated: isAnimated() })}
        style={indicatorStyle()}
      />
      <For each={props.tabs}>
        {(tab) => (
          <li
            class={styles.item({ size: props.size })}
            data-active={tab.value === props.activeTab ? '' : undefined}
          >
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
