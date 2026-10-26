import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';

import { NavItem } from '../types/NavItem';

export const getNavItems = (): NavItem[] => [
  {
    href: paths.meetings,
    label: i18n.t('nav.meetings'),
    icon: 'navigation:calendar',
    activeIcon: 'navigation:calendar-solid',
  },
  {
    href: paths.favorites,
    label: i18n.t('nav.favorites'),
    icon: 'navigation:bookmark',
    activeIcon: 'navigation:bookmark-solid',
  },
  {
    href: paths.actions,
    label: i18n.t('nav.actions'),
    icon: 'navigation:check',
    activeIcon: 'navigation:check-solid',
  },
  {
    href: paths.settings,
    label: i18n.t('labels.settings'),
    icon: 'navigation:settings',
    activeIcon: 'navigation:settings-solid',
  },
];
