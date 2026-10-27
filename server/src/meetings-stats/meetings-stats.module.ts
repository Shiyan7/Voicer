import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { MeetingEntity } from '../meetings/meeting.entity';
import { MeetingsStatsResolver } from './meetings-stats.resolver';
import { MeetingsStatsService } from './meetings-stats.service';
import { StatsResolver } from './stats.resolver';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity, ActionItemEntity])],
  providers: [
    MeetingsStatsService,
    MeetingsStatsResolver,
    StatsService,
    StatsResolver,
  ],
})
export class MeetingsStatsModule {}
