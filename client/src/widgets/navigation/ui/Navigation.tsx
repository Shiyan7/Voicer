import { createSignal, Show } from 'solid-js';

import { TeamSelect } from '@/entities/team-select';
import { Icon } from '@/shared/ui/icon';
import { useViewModel } from '@/shared/view-model';

import { NavigationViewModel } from '../model/NavigationViewModel';
import { ActivityBar } from './ActivityBar';
import { NavList } from './NavList';

export function Navigation() {
  const navigation = useViewModel(NavigationViewModel);
  const [isToggleShowed, setIsToggleShowed] = createSignal(false);

  return (
    <div
      class="relative z-navigation"
      onmouseleave={() => setIsToggleShowed(false)}
      onmouseenter={() => setIsToggleShowed(true)}
      data-collapsed={navigation.isCollapsed}
    >
      <div
        class={`
          relative z-1 h-full p-3
          w-60 bg-gray-100
          border-r-[0.5px] border-r-gray-400 data-[collapsed=true]:w-16
        `}
      >
        <Show when={isToggleShowed() && !navigation.isActivityOpened}>
          <button
            class={`
              absolute left-full top-5 z-20 flex h-8 w-6.5
              items-center justify-center rounded-[0_5px_5px_0]
              border-[0.5px] border-l-0 border-gray-400 bg-gray-100 pr-px
            `}
            onClick={navigation.toggleSidebar}
          >
            <Icon
              class="h-6 w-6"
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
