import { SessionService } from '@/entities/session';
import { ApiService } from '@/shared/api';
import { AuthTokens, tokenStore } from '@/shared/api/tokenStore';
import { LoginDTO, SignUpDTO } from '@/shared/api/types';
import { injectable } from '@/shared/di';
import { isTauri } from '@/shared/isTauri';

@injectable()
export class AuthService {
  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService,
  ) {}

  login = async (dto: LoginDTO) => {
    const tokens = await this.api.post<AuthTokens>('/auth/sign-in', dto);
    if (isTauri()) tokenStore.save(tokens);
    return this.session.getMe();
  };

  signup = async (dto: SignUpDTO) => {
    const tokens = await this.api.post<AuthTokens>('/auth/sign-up', dto);
    if (isTauri()) tokenStore.save(tokens);
    return this.session.getMe();
  };
}
