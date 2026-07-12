import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from '../meetings/meeting.entity';
import { MeetingsModule } from '../meetings/meetings.module';
import { StorageModule } from '../storage/storage.module';
import { AudioService } from './audio.service';
import { ProcessingService } from './processing.service';
import { SummaryService } from './summary.service';
import { TranscriptionService } from './transcription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingEntity]),
    MeetingsModule,
    StorageModule,
  ],
  providers: [
    ProcessingService,
    AudioService,
    TranscriptionService,
    SummaryService,
  ],
  exports: [ProcessingService],
})
export class ProcessingModule {}
