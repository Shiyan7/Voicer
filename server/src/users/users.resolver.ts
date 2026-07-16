import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from './user.entity';
import { UserMeOutput } from './models/user.model';

@Resolver(() => UserMeOutput)
export class UsersResolver {
  @Query(() => UserMeOutput)
  userMe(@CurrentUser() user: UserEntity): UserMeOutput {
    return user;
  }
}
