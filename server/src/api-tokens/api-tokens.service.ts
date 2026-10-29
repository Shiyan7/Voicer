import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { ApiTokenEntity } from './api-token.entity';
import { ApiTokenOutput } from './api-token.output';
import { ApiTokenCreatedOutput } from './api-token-created.output';

const TOKEN_PREFIX = 'vcr_';
const TOKEN_BYTES = 32;
const MAX_NAME_LENGTH = 100;
const DEFAULT_NAME = 'MCP';
const LAST_USED_THROTTLE_MS = 60_000;

@Injectable()
export class ApiTokensService {
  constructor(
    @InjectRepository(ApiTokenEntity)
    private readonly apiTokensRepository: Repository<ApiTokenEntity>,
  ) {}

  async getUserApiTokens(userId: string): Promise<ApiTokenOutput[]> {
    const apiTokens = await this.apiTokensRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      comment: this.getFnName(this.getUserApiTokens.name),
    });

    return apiTokens.map((apiToken) => this.serialize(apiToken));
  }

  async createApiToken(
    userId: string,
    name: string,
  ): Promise<ApiTokenCreatedOutput> {
    const secret = `${TOKEN_PREFIX}${randomBytes(TOKEN_BYTES).toString('base64url')}`;
    const apiToken = await this.apiTokensRepository.save(
      this.apiTokensRepository.create({
        userId,
        name: name.trim().slice(0, MAX_NAME_LENGTH) || DEFAULT_NAME,
        tokenHash: this.hash(secret),
      }),
    );

    return { apiToken: this.serialize(apiToken), secret };
  }

  async revokeApiToken(userId: string, id: string): Promise<boolean> {
    const { affected } = await this.apiTokensRepository.delete({ id, userId });

    if (!affected) {
      throw new NotFoundException('Токен не найден');
    }

    return true;
  }

  async findUserBySecret(secret: string): Promise<UserEntity | null> {
    if (!secret.startsWith(TOKEN_PREFIX)) return null;

    const apiToken = await this.apiTokensRepository.findOne({
      where: { tokenHash: this.hash(secret) },
      relations: { user: true },
      comment: this.getFnName(this.findUserBySecret.name),
    });

    if (!apiToken) return null;

    await this.touch(apiToken);

    return apiToken.user;
  }

  private async touch(apiToken: ApiTokenEntity): Promise<void> {
    const now = new Date();
    const lastUsedMs = apiToken.lastUsedAt?.getTime() ?? 0;

    if (now.getTime() - lastUsedMs < LAST_USED_THROTTLE_MS) return;

    await this.apiTokensRepository.update(apiToken.id, { lastUsedAt: now });
  }

  private hash(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }

  private serialize(apiToken: ApiTokenEntity): ApiTokenOutput {
    return {
      id: apiToken.id,
      name: apiToken.name,
      lastUsedAt: apiToken.lastUsedAt,
      createdAt: apiToken.createdAt,
    };
  }

  private getFnName(name: string): string {
    return `${ApiTokensService.name}.${name}`;
  }
}
