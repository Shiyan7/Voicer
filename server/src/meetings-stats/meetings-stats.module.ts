import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { MeetingEntity } from '../meetings/meeting.entity';
import { MeetingsStatsResolver } from './meetings-stats.resolver';
import { MeetingsStatsService } from './meetings-stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity, ActionItemEntity])],
  providers: [MeetingsStatsService, MeetingsStatsResolver],
})
export class MeetingsStatsModule {}
