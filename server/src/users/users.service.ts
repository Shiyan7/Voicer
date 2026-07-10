import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PasswordService } from '../auth/password.service';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private passwordService: PasswordService,
  ) {}

  async updateUser(userId: string, newUserData: UpdateUserInput) {
    await this.usersRepository.update({ id: userId }, newUserData);
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    await this.usersRepository.update(
      { id: userId },
      { password: hashedPassword },
    );

    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
