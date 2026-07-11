import { Location, Navigator } from '@solidjs/router';
import { singleton } from 'tsyringe';

import { SessionViewModel } from '@/entities/session';
import { RouterService } from '@/shared/router';

import { LocationService } from './router';
import { SingletonViewModel } from './view-model';

@singleton()
export class ApplicationViewModel extends SingletonViewModel {
  constructor(
    private readonly session: SessionViewModel,
    private readonly router: RouterService,
    private readonly location: LocationService,
  ) {
    super();
  }

  initApp(navigator: Navigator, location: Location) {
    this.router.init(navigator);
    this.location.init(location);
    void this.session.restoreSession();
  }
}
