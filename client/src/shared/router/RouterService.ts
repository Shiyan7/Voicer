import { Location, Navigator, Params } from '@solidjs/router';

import { singleton } from '@/shared/di';

@singleton()
export class RouterService<T extends Params = {}> {
  declare params: T;

  location: Location | null = null;

  get pathname() {
    return this.location?.pathname;
  }

  init(navigator: Navigator, location: Location, params: T) {
    this.navigate = navigator;
    this.location = location;
    this.params = params;
  }

  push(path: string) {
    this.navigate(path);
  }

  private navigate: Navigator = () => null;
}
