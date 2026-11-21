import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaudeModule } from '../claude/claude.module';
import { GeminiModule } from '../gemini/gemini.module';
import { McpModule } from '../mcp/mcp.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { ArchiveChatResponder } from './archive/archive-chat.responder';
import { ChatMessageEntity } from './chat-message.entity';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { MeetingChatResponder } from './meeting/meeting-chat.responder';
import { MeetingQuestionsResolver } from './meeting/meeting-questions.resolver';
import { MeetingQuestionsService } from './meeting/meeting-questions.service';
import { ChatThreadEntity } from './threads/chat-thread.entity';
import { ChatThreadsResolver } from './threads/chat-threads.resolver';
import { ChatThreadsService } from './threads/chat-threads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatThreadEntity, ChatMessageEntity]),
    ClaudeModule,
    GeminiModule,
    McpModule,
    MeetingsModule,
  ],
  providers: [
    ChatService,
    ChatThreadsService,
    MeetingChatResponder,
    ArchiveChatResponder,
    MeetingQuestionsService,
    ChatResolver,
    ChatThreadsResolver,
    MeetingQuestionsResolver,
  ],
})
export class ChatModule {}
