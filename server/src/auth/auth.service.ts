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
    const hashedPassword = await this.passwordService.hashPassword(password);
    const name = email.split('@')[0];

    try {
      const user = await this.usersRepository.save(
        this.usersRepository.create({
          email,
          password: hashedPassword,
          name,
        }),
      );

      return this.generateTokens({ userId: user.id });
    } catch (e) {
      if (this.isUniqueConstraintError(e)) {
        throw new ConflictException('Такой e-mail уже существует');
      }

      throw e;
    }
  }

  async signIn(email: string, password: string): Promise<AuthTokens> {
    const user = await this.usersRepository.findOne({
      where: { email },
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

  private isUniqueConstraintError(e: unknown): boolean {
    if (!e || typeof e !== 'object') {
      return false;
    }

    const err: any = e;
    return err?.code === '23505';
  }
}
