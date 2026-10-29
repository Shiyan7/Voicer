import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { ApiTokenOutput } from './api-token.output';
import { ApiTokenCreatedOutput } from './api-token-created.output';
import { ApiTokensService } from './api-tokens.service';

@Resolver(() => ApiTokenOutput)
export class ApiTokensResolver {
  constructor(private readonly apiTokensService: ApiTokensService) {}

  @Query(() => [ApiTokenOutput])
  apiTokens(@CurrentUser() user: UserEntity): Promise<ApiTokenOutput[]> {
    return this.apiTokensService.getUserApiTokens(user.id);
  }

  @Mutation(() => ApiTokenCreatedOutput)
  apiTokenCreate(
    @CurrentUser() user: UserEntity,
    @Args('name') name: string,
  ): Promise<ApiTokenCreatedOutput> {
    return this.apiTokensService.createApiToken(user.id, name);
  }

  @Mutation(() => Boolean)
  apiTokenRevoke(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.apiTokensService.revokeApiToken(user.id, id);
  }
}
