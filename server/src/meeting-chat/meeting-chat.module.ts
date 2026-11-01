import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiModule } from '../gemini/gemini.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { ChatMessageEntity } from './chat-message.entity';
import { MeetingChatResolver } from './meeting-chat.resolver';
import { MeetingChatService } from './meeting-chat.service';
import { MeetingQuestionsService } from './meeting-questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessageEntity]),
    GeminiModule,
    MeetingsModule,
  ],
  providers: [MeetingChatService, MeetingQuestionsService, MeetingChatResolver],
})
export class MeetingChatModule {}
