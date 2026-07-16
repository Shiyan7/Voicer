import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthPayload } from './models/auth-payload.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Mutation(() => AuthPayload)
  signUp(@Args('input') input: SignUpInput): Promise<AuthPayload> {
    return this.auth.signUp(input);
  }

  @Public()
  @Mutation(() => AuthPayload)
  signIn(@Args('input') input: SignInInput): Promise<AuthPayload> {
    return this.auth.signIn(input.email, input.password);
  }
}
