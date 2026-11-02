import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
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
      inject: [AuthService, ConfigService],
      useFactory: (authService: AuthService, config: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: config.get('NODE_ENV') !== 'production',
        introspection: config.get('NODE_ENV') !== 'production',
        subscriptions: {
          'graphql-ws': {
            onConnect: buildWsOnConnect(authService),
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
