import { Navigator } from '@solidjs/router';
import { injectable } from 'tsyringe';

@injectable()
export class RouterService {
  registerNavigator(navigator: Navigator) {
    this.navigate = navigator;
  }

  push(path: string) {
    this.navigate(path);
  }

  private navigate: Navigator = () => null;
}
