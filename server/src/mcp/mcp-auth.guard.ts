import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTokensService } from '../api-tokens/api-tokens.service';
import { UserEntity } from '../users/user.entity';
import { McpSessionTokensService } from './mcp-session-tokens.service';

const BEARER_PREFIX = 'Bearer ';

@Injectable()
export class McpAuthGuard implements CanActivate {
  constructor(
    private readonly apiTokensService: ApiTokensService,
    private readonly sessionTokensService: McpSessionTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization ?? '';

    if (!header.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedException();
    }

    const user = await this.findUser(header.slice(BEARER_PREFIX.length).trim());

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }

  private async findUser(secret: string): Promise<UserEntity | null> {
    return (
      (await this.sessionTokensService.findUser(secret)) ??
      this.apiTokensService.findUserBySecret(secret)
    );
  }
}
