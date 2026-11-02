import { UnauthorizedException } from '@nestjs/common';
import { Context } from 'graphql-ws';
import { AuthService } from '../auth/auth.service';

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

export const buildWsOnConnect =
  (authService: AuthService) =>
  async (context: Context<Record<string, unknown>>): Promise<boolean> => {
    const token = readToken(context.connectionParams);
    if (!token) throw new UnauthorizedException();

    (context.extra as Record<string, unknown>).user =
      await authService.authenticateAccessToken(token);
    return true;
  };
