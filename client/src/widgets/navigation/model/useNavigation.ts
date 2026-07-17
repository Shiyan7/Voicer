import { useLocation } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { getNavItems } from '../config/getNavItems';

export const useNavigation = () => {
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = createSignal(false);
  const [isToggleVisible, setIsToggleVisible] = createSignal(false);

  const navItems = () =>
    getNavItems().map((item) => ({
      ...item,
      isActive: item.href === location.pathname,
    }));

  const toggleSidebar = () => setIsCollapsed((collapsed) => !collapsed);

  const onMouseEnter = () => setIsToggleVisible(true);

  const onMouseLeave = () => setIsToggleVisible(false);

  return {
    isCollapsed,
    isToggleVisible,
    navItems,
    toggleSidebar,
    onMouseEnter,
    onMouseLeave,
  };
}
