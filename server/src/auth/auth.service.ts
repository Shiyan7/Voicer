import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from './password.service';
import { SignUpInput } from './dto/sign-up.input';
import { UserEntity } from '../users/user.entity';
import { isUniqueConstraintError } from '../common/is-unique-constraint-error';
import { AuthPayload } from './models/auth-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {}

  async signUp({ email, password }: SignUpInput): Promise<AuthPayload> {
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

  async signIn(email: string, password: string): Promise<AuthPayload> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user?.password) {
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

  async validateUser(userId: unknown): Promise<UserEntity | null> {
    if (typeof userId !== 'string' || !userId) return null;

    return this.usersRepository.findOne({ where: { id: userId } });
  }

  generateTokens(payload: { userId: string }): AuthPayload {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
