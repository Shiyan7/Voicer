import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { GqlAuthGuard } from './auth/guards/gql-auth.guard';
import { UsersModule } from './users/users.module';
import { MeetingsModule } from './meetings/meetings.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphqlModule,
    AuthModule,
    UsersModule,
    MeetingsModule,
    ActionsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: GqlAuthGuard }],
})
export class AppModule {}
