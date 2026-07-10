import { injectable } from 'tsyringe';

import { SessionService } from '@/entities/session';
import { ApiService } from '@/shared/api';
import { LoginDTO, SignUpDTO } from '@/shared/api/types';

@injectable()
export class AuthService {
  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService,
  ) {}

  login = async (dto: LoginDTO) => {
    await this.api.post('/auth/sign-in', dto);
    return this.session.getMe();
  };

  signup = async (dto: SignUpDTO) => {
    await this.api.post('/auth/sign-up', dto);
    return this.session.getMe();
  };
}
