import { A, useLocation } from '@solidjs/router';
import { createEffect, For, onCleanup, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { i18n } from '@/shared/i18n';
import { Icon, type IconName } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { navItems } from '../config/navItems';
import { NavigationViewModel } from '../model/NavigationViewModel';
import { navListStyles } from './NavList.styles';

const styles = navListStyles();

export function NavList() {
  const location = useLocation();
  const navigation = useViewModel(NavigationViewModel);

  const isItemActive = (href?: string) =>
    href ? href === location.pathname : navigation.isActivityOpened;

  createEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[id="activity"]')) return;
      if (navigation.isActivityOpened) navigation.closeActivity();
    };

    document.body.addEventListener('click', onClick);
    onCleanup(() => document.body.removeEventListener('click', onClick));
  });

  return (
    <ul class={styles.root()}>
      <For each={navItems}>
        {(item, index) => (
          <li>
            <Dynamic
              class={styles.item()}
              id={item.label}
              component={item.href ? A : 'button'}
              href={item.href}
              onClick={item.href ? undefined : navigation.toggleActivity}
              data-current={isItemActive(item.href)}
            >
              <Icon
                class={styles.itemIcon()}
                name={
                  (isItemActive(item.href)
                    ? `${item.icon}-solid`
                    : item.icon) as IconName
                }
              />
              <Show when={!navigation.isCollapsed}>{i18n.t(item.label)}</Show>
            </Dynamic>
            <Show when={!navigation.isCollapsed}>
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
