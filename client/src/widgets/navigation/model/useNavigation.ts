import { useLocation } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';

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

  const toggleIcon = () =>
    isCollapsed() ? 'common:chevron-right' : 'common:chevron-left';

  const toggleLabel = () =>
    isCollapsed() ? i18n.t('nav.expand') : i18n.t('nav.collapse');

  const onMouseEnter = () => setIsToggleVisible(true);

  const onMouseLeave = () => setIsToggleVisible(false);

  return {
    isCollapsed,
    isToggleVisible,
    navItems,
    toggleSidebar,
    toggleIcon,
    toggleLabel,
    onMouseEnter,
    onMouseLeave,
  };
};
