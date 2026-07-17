import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { KeyPointEntity } from './key-point.entity';
import { MeetingsResolver } from './meetings.resolver';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingEntity,
      TranscriptSegmentEntity,
      KeyPointEntity,
    ]),
  ],
  providers: [MeetingsService, MeetingsResolver],
})
export class MeetingsModule {}
