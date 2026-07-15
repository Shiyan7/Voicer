import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserEntity } from '../users/user.entity';
import { UserMeOutput } from '../users/models/user.model';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshInput } from './dto/refresh.input';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthPayload } from './models/auth-payload.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => AuthPayload)
  signUp(@Args('input') input: SignUpInput): Promise<AuthPayload> {
    return this.auth.signUp(input);
  }

  @Mutation(() => AuthPayload)
  signIn(@Args('input') input: SignInInput): Promise<AuthPayload> {
    return this.auth.signIn(input.email, input.password);
  }

  @Mutation(() => AuthPayload)
  refresh(@Args('input') input: RefreshInput): AuthPayload {
    return this.auth.refreshToken(input.refreshToken);
  }

  @Query(() => UserMeOutput)
  @UseGuards(GqlAuthGuard)
  userMe(@CurrentUser() user: UserEntity): UserMeOutput {
    return user;
  }
}
