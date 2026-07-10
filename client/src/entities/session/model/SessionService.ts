import { injectable } from 'tsyringe';

import { ApiService } from '@/shared/api';
import { MinimalUserOutput } from '@/shared/api/types';

@injectable()
export class SessionService {
  constructor(private readonly api: ApiService) {}

  async getMe() {
    return await this.api.get<MinimalUserOutput>('/users/me');
  }

  logout() {
    return this.api.post<{ ok: boolean }>('/auth/logout');
  }

  async restore() {
    await this.refreshToken();

    try {
      return await this.getMe();
    } catch {
      await this.logout();
    }
  }

  private refreshToken = async () => {
    await this.api.post('/auth/refresh');
  };
}
