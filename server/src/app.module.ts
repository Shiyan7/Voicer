import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MeetingsModule } from './meetings/meetings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphqlModule,
    AuthModule,
    UsersModule,
    MeetingsModule,
  ],
})
export class AppModule {}
