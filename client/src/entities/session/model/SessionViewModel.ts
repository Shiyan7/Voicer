import { singleton } from '@/shared/di';

import { MinimalUserOutput } from '@/shared/api/types';
import { SingletonViewModel } from '@/shared/view-model';

import { SessionService } from './SessionService';

@singleton()
export class SessionViewModel extends SingletonViewModel {
  user: MinimalUserOutput | null = null;

  isAuthorized = false;

  constructor(private readonly session: SessionService) {
    super();
  }

  login = (user: MinimalUserOutput) => {
    this.user = user;
    this.isAuthorized = true;
  };

  async restoreSession() {
    const user = await this.session.restore();
    if (user) this.login(user);
  }

  logout = async () => {
    await this.session.logout();
    this.user = null;
    this.isAuthorized = false;
  };
}
