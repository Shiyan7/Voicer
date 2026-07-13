import { Location, Navigator, Params } from '@solidjs/router';
import { singleton } from 'tsyringe';

import { SessionViewModel } from '@/entities/session';
import { RouterService } from '@/shared/router';

import { SingletonViewModel } from './view-model';

@singleton()
export class ApplicationViewModel extends SingletonViewModel {
  constructor(
    private readonly session: SessionViewModel,
    private readonly router: RouterService,
  ) {
    super();
  }

  initRouter(navigator: Navigator, location: Location, params: Params) {
    this.router.init(navigator, location, params);
  }

  initApp() {
    void this.session.restoreSession();
  }
}
