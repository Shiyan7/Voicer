import { A, useLocation } from '@solidjs/router';
import { createSelector, For, Show } from 'solid-js';

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
  const location = useLocation();

  const isItemActive = createSelector(() => location.pathname);

  return (
    <ul class={styles.root()}>
      <For each={props.items}>
        {(item, index) => (
          <li>
            <A
              class={styles.item()}
              href={item.href}
              data-current={isItemActive(item.href)}
            >
              <Icon
                class={styles.itemIcon()}
                name={isItemActive(item.href) ? item.activeIcon : item.icon}
              />
              <Show when={!props.isCollapsed}>{item.label}</Show>
            </A>
            <Show when={!props.isCollapsed}>
              {index() === 0 && (
                <span class={styles.separator()}>
                  {i18n.t('nav.workspace')}
                </span>
              )}
            </Show>
          </li>
        )}
      </For>
    </ul>
  );
}
