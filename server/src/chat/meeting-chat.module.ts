import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { GeminiModule } from '../gemini/gemini.module';
import { KeyPointEntity } from '../meetings/key-point.entity';
import { MeetingEntity } from '../meetings/meeting.entity';
import { TranscriptSegmentEntity } from '../meetings/transcript-segment.entity';
import { SummarizationModule } from '../summarization/summarization.module';
import { ChatMessageEntity } from './chat-message.entity';
import { MeetingChatResolver } from './meeting-chat.resolver';
import { MeetingChatService } from './meeting-chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingEntity,
      ChatMessageEntity,
      TranscriptSegmentEntity,
      KeyPointEntity,
      ActionItemEntity,
    ]),
    GeminiModule,
    SummarizationModule,
  ],
  providers: [MeetingChatService, MeetingChatResolver],
})
export class MeetingChatModule {}
