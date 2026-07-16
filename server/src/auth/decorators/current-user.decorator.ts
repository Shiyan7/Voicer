import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserEntity } from 'src/users/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserEntity =>
    GqlExecutionContext.create(context).getContext().req.user,
);
