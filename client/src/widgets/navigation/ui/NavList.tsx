import { A, useLocation } from '@solidjs/router';
import { createEffect, For, onCleanup, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { i18n } from '@/shared/i18n';
import { Icon, type IconName } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { navItems } from '../config/navItems';
import { NavigationViewModel } from '../model/NavigationViewModel';

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
    <ul class="mb-5 mt-7 flex flex-col gap-1">
      <For each={navItems}>
        {(item, index) => (
          <li>
            <Dynamic
              class={`
                  text-md flex w-full items-center p-1 px-2 font-medium
                  rounded-lg text-gray-900 hover:bg-gray-200
                  data-[current=true]:bg-gray-200 data-[current=false]:active:bg-gray-300
                  cursor-pointer transition-colors
                
                `}
              id={item.label}
              component={item.href ? A : 'button'}
              href={item.href}
              onClick={item.href ? undefined : navigation.toggleActivity}
              data-current={isItemActive(item.href)}
            >
              <Icon
                class="mr-1 h-5 w-5"
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
                <span class="mb-1 mt-3 block px-2 text-[12px] font-bold text-gray-500">
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
