import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Context } from 'graphql-ws';
import { AuthService } from '../auth/auth.service';
import { JwtDto } from '../auth/dto/jwt.dto';

const extractBearer = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const [scheme, token] = value.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

const readToken = (
  connectionParams: Record<string, unknown> | undefined,
): string | null => {
  if (!connectionParams) return null;
  const key = Object.keys(connectionParams).find(
    (name) => name.toLowerCase() === 'authorization',
  );
  return extractBearer(key ? connectionParams[key] : undefined);
};

export const authenticateAccessToken = async (
  jwtService: JwtService,
  configService: ConfigService,
  authService: AuthService,
  token: string,
) => {
  const payload = await jwtService.verifyAsync<JwtDto>(token, {
    secret: configService.get<string>('JWT_ACCESS_SECRET'),
  });

  const user = await authService.validateUser(payload.userId);
  if (!user) throw new UnauthorizedException();
  return user;
};

export const buildWsOnConnect =
  (
    jwtService: JwtService,
    configService: ConfigService,
    authService: AuthService,
  ) =>
  async (context: Context<Record<string, unknown>>): Promise<boolean> => {
    const token = readToken(context.connectionParams);
    if (!token) throw new UnauthorizedException();

    const user = await authenticateAccessToken(
      jwtService,
      configService,
      authService,
      token,
    );

    (context.extra as Record<string, unknown>).user = user;
    return true;
  };
