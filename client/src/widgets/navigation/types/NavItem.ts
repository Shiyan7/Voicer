import { IconName } from '@/shared/ui/icon';

export interface NavItem {
  label?: string;
  href: string;
  icon: IconName;
  activeIcon: IconName;
  isActive?: boolean;
}
