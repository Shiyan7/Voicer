import { Show } from 'solid-js';

import { TeamSelect } from '@/entities/team-select';
import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';

import { useNavigation } from '../model/useNavigation';
import { navigationStyles } from './Navigation.styles';
import { NavList } from './NavList';
import { ProButton } from './ProButton';

const styles = navigationStyles();

export function Navigation() {
  const vm = useNavigation();

  return (
    <div
      class={styles.root()}
      onmouseleave={vm.onMouseLeave}
      onmouseenter={vm.onMouseEnter}
    >
      <div class={styles.sidebar({ collapsed: vm.isCollapsed() })}>
        <Show when={vm.isToggleVisible()}>
          <button
            class={styles.toggle()}
            type="button"
            aria-label={vm.toggleLabel()}
            onClick={vm.toggleSidebar}
          >
            <Icon class={styles.toggleIcon()} name={vm.toggleIcon()} />
          </button>
        </Show>
        <div class={styles.logo({ collapsed: vm.isCollapsed() })}>
          <Logo isCompact={vm.isCollapsed()} />
        </div>
        <button
          class={styles.search({ collapsed: vm.isCollapsed() })}
          type="button"
          onClick={vm.openSearch}
        >
          <Icon class={styles.searchIcon()} name="common:search" />
          <Show when={!vm.isCollapsed()}>
            <span class={styles.searchLabel()}>{i18n.t('labels.search')}</span>
            <kbd class={styles.searchHotkey()}>⌘K</kbd>
          </Show>
        </button>
        <NavList items={vm.navItems()} isCollapsed={vm.isCollapsed()} />
        <div class={styles.account({ collapsed: vm.isCollapsed() })}>
          <TeamSelect isCollapsed={vm.isCollapsed()} />
          <ProButton isCollapsed={vm.isCollapsed()} />
        </div>
      </div>
    </div>
  );
}
