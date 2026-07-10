import { singleton } from 'tsyringe';

import { SingletonViewModel } from '@/shared/view-model';

@singleton()
export class NavigationViewModel extends SingletonViewModel {
  isActivityOpened = false;
  isCollapsed = false;

  toggleSidebar = () => {
    this.isCollapsed = !this.isCollapsed;
  };

  toggleActivity = () => {
    this.isActivityOpened = !this.isActivityOpened;
  };

  closeActivity = () => {
    this.isActivityOpened = false;
  };
}
