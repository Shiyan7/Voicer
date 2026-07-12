import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/user.entity';
import { MeetingsModule } from './meetings/meetings.module';
import { MeetingEntity } from './meetings/meeting.entity';
import { TranscriptSegmentEntity } from './meetings/transcript-segment.entity';
import { ActionItemEntity } from './meetings/action-item.entity';
import { StorageModule } from './storage/storage.module';
import { ProcessingModule } from './processing/processing.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          entities: [
            UserEntity,
            MeetingEntity,
            TranscriptSegmentEntity,
            ActionItemEntity,
          ],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    StorageModule,
    MeetingsModule,
    ProcessingModule,
    EventsModule,
  ],
})
export class AppModule {}
