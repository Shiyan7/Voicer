import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { KeyPointEntity } from './key-point.entity';
import { ActionItemEntity } from '../actions/action-item.entity';
import { FileModule } from '../file/file.module';
import { TranscriptionModule } from '../transcription/transcription.module';
import { SummarizationModule } from '../summarization/summarization.module';
import { MeetingsResolver } from './meetings.resolver';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingEntity,
      TranscriptSegmentEntity,
      KeyPointEntity,
      ActionItemEntity,
    ]),
    FileModule,
    TranscriptionModule,
    SummarizationModule,
  ],
  providers: [MeetingsService, MeetingsResolver],
})
export class MeetingsModule {}
