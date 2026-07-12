import { Location } from '@solidjs/router';
import { singleton } from '@/shared/di';

@singleton()
export class LocationService {
  location: Location | null = null;

  get pathname() {
    return this.location?.pathname;
  }

  init(location: Location) {
    this.location = location;
  }
}
