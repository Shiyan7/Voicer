import { injectable } from 'tsyringe';

import { StatefulViewModel } from '@/shared/view-model';

import { getNavItems } from '../config/getNavItems';

@injectable()
export class NavigationViewModel extends StatefulViewModel {
  isCollapsed = false;
  isToggleVisible = false;

  get navItems() {
    return getNavItems();
  }

  toggleSidebar = () => {
    this.isCollapsed = !this.isCollapsed;
  };

  onMouseLeave = () => {
    this.isToggleVisible = false;
  };

  onMouseEnter = () => {
    this.isToggleVisible = true;
  };
}
