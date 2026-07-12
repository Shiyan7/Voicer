import { Navigator } from '@solidjs/router';

import { singleton } from '@/shared/di';

@singleton()
export class RouterService {
  init(navigator: Navigator) {
    this.navigate = navigator;
  }

  push(path: string) {
    this.navigate(path);
  }

  private navigate: Navigator = () => null;
}
