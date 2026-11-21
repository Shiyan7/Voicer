import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { McpSessionToken } from './mcp-session-token';

const TOKEN_BYTES = 32;

@Injectable()
export class McpSessionTokensService {
  private readonly userIds = new Map<string, string>();

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  issue(userId: string, ttlMs: number): McpSessionToken {
    const token = randomBytes(TOKEN_BYTES).toString('base64url');
    this.userIds.set(token, userId);

    const expiry = setTimeout(() => this.userIds.delete(token), ttlMs);
    const revoke = (): void => {
      clearTimeout(expiry);
      this.userIds.delete(token);
    };

    return { token, revoke };
  }

  async findUser(token: string): Promise<UserEntity | null> {
    const userId = this.userIds.get(token);
    if (!userId) return null;

    return this.usersRepository.findOneBy({ id: userId });
  }
}
