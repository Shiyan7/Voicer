import { Navigator } from '@solidjs/router';
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

  initApp(navigator: Navigator) {
    this.router.registerNavigator(navigator);
    void this.session.restoreSession();
  }
}
