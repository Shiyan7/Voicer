import { injectable } from 'tsyringe';

import { LocationService } from '@/shared/router';
import { StatefulViewModel } from '@/shared/view-model';

import { getNavItems } from '../config/getNavItems';

@injectable()
export class NavigationViewModel extends StatefulViewModel {
  isCollapsed = false;
  isToggleVisible = false;

  constructor(private readonly location: LocationService) {
    super();
  }

  get navItems() {
    return getNavItems().map((item) => ({
      ...item,
      isActive: item.href === this.location.pathname,
    }));
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
