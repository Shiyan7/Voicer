import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { NavItem } from '../types/NavItem';
import { navListStyles } from './NavList.styles';

const styles = navListStyles();

interface NavListProps {
  items: NavItem[];
  isCollapsed: boolean;
}

export function NavList(props: NavListProps) {
  return (
    <ul class={styles.root()}>
      <li class={styles.separator()}>{i18n.t('nav.workspace')}</li>
      <For each={props.items}>
        {(item) => (
          <li>
            <A
              class={styles.item()}
              href={item.href}
              data-current={item.isActive}
            >
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
