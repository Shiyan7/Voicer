import { createSignal, Show } from 'solid-js';

import { TeamSelect } from '@/entities/team-select';
import { Icon } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { NavigationViewModel } from '../model/NavigationViewModel';
import { ActivityBar } from './ActivityBar';
import { navigationStyles } from './Navigation.styles';
import { NavList } from './NavList';

const styles = navigationStyles();

export function Navigation() {
  const navigation = useViewModel(NavigationViewModel);
  const [isToggleShowed, setIsToggleShowed] = createSignal(false);

  return (
    <div
      class={styles.root()}
      onmouseleave={() => setIsToggleShowed(false)}
      onmouseenter={() => setIsToggleShowed(true)}
      data-collapsed={navigation.isCollapsed}
    >
      <div class={styles.sidebar()} data-collapsed={navigation.isCollapsed}>
        <Show when={isToggleShowed() && !navigation.isActivityOpened}>
          <button class={styles.toggle()} onClick={navigation.toggleSidebar}>
            <Icon
              class={styles.toggleIcon()}
              name={
                navigation.isCollapsed
                  ? 'common:arrow-right-end'
                  : 'common:arrow-left-end'
              }
            />
          </button>
        </Show>
        <TeamSelect isExpanded={!navigation.isCollapsed} />
        <NavList />
      </div>
      <ActivityBar />
    </div>
  );
}
