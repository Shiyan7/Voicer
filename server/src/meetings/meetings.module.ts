import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { KeyPointEntity } from './key-point.entity';
import { FileModule } from '../file/file.module';
import { MeetingsResolver } from './meetings.resolver';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingEntity,
      TranscriptSegmentEntity,
      KeyPointEntity,
    ]),
    FileModule,
  ],
  providers: [MeetingsService, MeetingsResolver],
})
export class MeetingsModule {}
