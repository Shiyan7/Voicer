import { injectable } from '@/shared/di';
import { RouterService } from '@/shared/router';
import { StatefulViewModel } from '@/shared/view-model';

import { getNavItems } from '../config/getNavItems';

@injectable()
export class NavigationViewModel extends StatefulViewModel {
  isCollapsed = false;
  isToggleVisible = false;

  constructor(private readonly router: RouterService) {
    super();
  }

  get navItems() {
    return getNavItems().map((item) => ({
      ...item,
      isActive: item.href === this.router.pathname,
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
