import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req }: { req: unknown }) => ({ req }),
      formatError: (formattedError: GraphQLFormattedError) => ({
        message: formattedError.message,
        extensions: {
          code: formattedError.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
        },
      }),
    }),
  ],
})
export class GraphqlModule {}
