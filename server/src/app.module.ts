import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { GqlAuthGuard } from './auth/guards/gql-auth.guard';
import { UsersModule } from './users/users.module';
import { MeetingsModule } from './meetings/meetings.module';
import { StatsModule } from './stats/stats.module';
import { SearchModule } from './search/search.module';
import { ActionsModule } from './actions/actions.module';
import { MeetingChatModule } from './meeting-chat/meeting-chat.module';
import { PubSubModule } from './pubsub/pubsub.module';
import { ApiTokensModule } from './api-tokens/api-tokens.module';
import { McpModule } from './mcp/mcp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PubSubModule,
    GraphqlModule,
    AuthModule,
    UsersModule,
    MeetingsModule,
    StatsModule,
    SearchModule,
    ActionsModule,
    MeetingChatModule,
    ApiTokensModule,
    McpModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: GqlAuthGuard }],
})
export class AppModule {}
