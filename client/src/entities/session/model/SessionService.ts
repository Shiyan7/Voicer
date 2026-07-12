import { ApiService } from '@/shared/api';
import { AuthTokens, tokenStore } from '@/shared/api/tokenStore';
import { MinimalUserOutput } from '@/shared/api/types';
import { injectable } from '@/shared/di';
import { isTauri } from '@/shared/isTauri';

@injectable()
export class SessionService {
  constructor(private readonly api: ApiService) {}

  async getMe() {
    return await this.api.get<MinimalUserOutput>('/users/me');
  }

  logout() {
    tokenStore.clear();
    return this.api.post<{ ok: boolean }>('/auth/logout');
  }

  async restore() {
    try {
      await this.refreshToken();
    } catch {
      tokenStore.clear();
      return undefined;
    }

    try {
      return await this.getMe();
    } catch {
      await this.logout();
    }
  }

  private refreshToken = async () => {
    const body = isTauri()
      ? { refreshToken: tokenStore.refreshToken ?? '' }
      : undefined;

    const tokens = await this.api.post<AuthTokens>('/auth/refresh', body);
    if (isTauri()) tokenStore.save(tokens);
  };
}
