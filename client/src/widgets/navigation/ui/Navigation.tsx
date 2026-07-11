import { Show } from 'solid-js';

import { TeamSelect } from '@/entities/team-select';
import { Icon } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { NavigationViewModel } from '../model/NavigationViewModel';
import { navigationStyles } from './Navigation.styles';
import { NavList } from './NavList';

const styles = navigationStyles();

export function Navigation() {
  const vm = useViewModel(NavigationViewModel);

  return (
    <div
      class={styles.root()}
      onmouseleave={vm.onMouseLeave}
      onmouseenter={vm.onMouseEnter}
    >
      <div class={styles.sidebar({ collapsed: vm.isCollapsed })}>
        <Show when={vm.isToggleVisible}>
          <button class={styles.toggle()} onClick={vm.toggleSidebar}>
            <Icon
              class={styles.toggleIcon()}
              name={
                vm.isCollapsed
                  ? 'common:arrow-right-end'
                  : 'common:arrow-left-end'
              }
            />
          </button>
        </Show>
        <TeamSelect isCollapsed={vm.isCollapsed} />
        <NavList items={vm.navItems} isCollapsed={vm.isCollapsed} />
      </div>
    </div>
  );
}
