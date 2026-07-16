import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from './password.service';
import { SignUpInput } from './dto/sign-up.input';
import { UserEntity } from '../users/user.entity';
import { isUniqueConstraintError } from '../common/is-unique-constraint-error';

export type AuthTokens = {
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {}

  async signUp({ email, password }: SignUpInput): Promise<AuthTokens> {
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await this.passwordService.hashPassword(password);
    const [name] = normalizedEmail.split('@');

    try {
      const user = await this.usersRepository.save(
        this.usersRepository.create({
          email: normalizedEmail,
          password: hashedPassword,
          name,
        }),
      );

      return this.generateTokens({ userId: user.id });
    } catch (e) {
      if (isUniqueConstraintError(e)) {
        throw new ConflictException('Такой e-mail уже существует');
      }

      throw e;
    }
  }

  async signIn(email: string, password: string): Promise<AuthTokens> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('Пользователь с таким e-mail не найден');
    }

    if (!user.password) {
      throw new BadRequestException('Неправильный логин или пароль');
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Неправильный логин или пароль');
    }

    return this.generateTokens({ userId: user.id });
  }

  validateUser(userId: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  generateTokens(payload: { userId: string }): AuthTokens {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
