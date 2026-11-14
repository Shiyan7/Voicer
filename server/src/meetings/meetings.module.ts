import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { KeyPointEntity } from './key-point.entity';
import { MeetingScreenshotEntity } from './meeting-screenshot.entity';
import { MeetingScreenshotsService } from './meeting-screenshots.service';
import { MeetingScreenshotsResolver } from './meeting-screenshots.resolver';
import { ActionItemEntity } from '../actions/action-item.entity';
import { FileModule } from '../file/file.module';
import { InterviewAccessModule } from '../interview/access/interview-access.module';
import { TranscriptionModule } from '../transcription/transcription.module';
import { SummarizationModule } from '../summarization/summarization.module';
import { MeetingsResolver } from './meetings.resolver';
import { MeetingContentService } from './meeting-content.service';
import { MeetingsService } from './meetings.service';
import { MeetingProcessingService } from './meeting-processing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingEntity,
      TranscriptSegmentEntity,
      KeyPointEntity,
      MeetingScreenshotEntity,
      ActionItemEntity,
    ]),
    FileModule,
    InterviewAccessModule,
    TranscriptionModule,
    SummarizationModule,
  ],
  providers: [
    MeetingsService,
    MeetingContentService,
    MeetingProcessingService,
    MeetingsResolver,
    MeetingScreenshotsService,
    MeetingScreenshotsResolver,
  ],
  exports: [MeetingsService, MeetingContentService],
})
export class MeetingsModule {}
