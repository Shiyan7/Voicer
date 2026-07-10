import { DictKey } from '@/shared/i18n/types';
import { paths } from '@/shared/router';
import { IconName } from '@/shared/ui/icon';

type NavItem = {
  label: DictKey;
  href?: string;
  icon: IconName;
};

export const navItems: NavItem[] = [
  {
    label: 'nav.activity',
    icon: 'navigation:bell',
  },
  {
    href: paths.meetings,
    label: 'nav.meetings',
    icon: 'navigation:calendar',
  },
  {
    href: paths.actions,
    label: 'nav.actions',
    icon: 'navigation:check',
  },
  {
    href: paths.settings,
    label: 'labels.settings',
    icon: 'navigation:settings',
  },
];
