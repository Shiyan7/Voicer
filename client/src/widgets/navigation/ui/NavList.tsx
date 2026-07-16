import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';

import { NavListProps } from '../types/NavListProps';
import { navListStyles } from './NavList.styles';

const styles = navListStyles();

export function NavList(props: NavListProps) {
  return (
    <ul class={styles.root()}>
      <For each={props.items}>
        {(item) => (
          <li>
            <A class={styles.item({ current: item.isActive })} href={item.href}>
              <Icon
                class={styles.itemIcon()}
                name={item.isActive ? item.activeIcon : item.icon}
              />
              <Show when={!props.isCollapsed}>{item.label}</Show>
            </A>
          </li>
        )}
      </For>
    </ul>
  );
}
