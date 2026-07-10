import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserEntity as UserEntityModel } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('/me')
  async me(
    @UserEntity() user: UserEntityModel,
  ): Promise<Partial<UserEntityModel>> {
    const { password, googleId, id, ...rest } = user;

    return rest;
  }

  @Post('/update')
  async updateUser(
    @UserEntity() user: UserEntityModel,
    @Body() newUserData: UpdateUserInput,
  ) {
    return this.users.updateUser(user.id, newUserData);
  }

  @Post('/change-password')
  async changePassword(
    @UserEntity() user: UserEntityModel,
    @Body() changePassword: ChangePasswordInput,
  ) {
    return this.users.changePassword(user.id, user.password, changePassword);
  }
}
