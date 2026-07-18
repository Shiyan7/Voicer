import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { buildWsOnConnect } from './ws-auth';

interface GraphqlContextInput {
  req?: { user?: unknown };
  extra?: { user?: unknown };
}

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService, ConfigService, AuthService],
      useFactory: (
        jwtService: JwtService,
        configService: ConfigService,
        authService: AuthService,
      ) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: true,
        introspection: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: buildWsOnConnect(jwtService, configService, authService),
          },
        },
        context: ({ req, extra }: GraphqlContextInput) =>
          extra?.user ? { req: { user: extra.user } } : { req },
        formatError: (formattedError: GraphQLFormattedError) => ({
          message: formattedError.message,
          extensions: {
            code: formattedError.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
          },
        }),
      }),
    }),
  ],
})
export class GraphqlModule {}
