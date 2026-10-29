import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTokensService } from '../api-tokens/api-tokens.service';

const BEARER_PREFIX = 'Bearer ';

@Injectable()
export class McpAuthGuard implements CanActivate {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization ?? '';

    if (!header.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedException();
    }

    const user = await this.apiTokensService.findUserBySecret(
      header.slice(BEARER_PREFIX.length).trim(),
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }
}
