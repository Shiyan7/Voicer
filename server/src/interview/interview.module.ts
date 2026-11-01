import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GeminiModule } from '../gemini/gemini.module';
import { GroqModule } from '../groq/groq.module';
import { InterviewAnswersService } from './interview-answers.service';
import { InterviewHistoryService } from './interview-history.service';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionsService } from './interview-sessions.service';
import { InterviewResolver } from './interview.resolver';
import { LiveAudioGateway } from './live/live-audio.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterviewSessionEntity]),
    AuthModule,
    GeminiModule,
    GroqModule,
  ],
  providers: [
    InterviewSessionsService,
    InterviewAnswersService,
    InterviewHistoryService,
    InterviewResolver,
    LiveAudioGateway,
  ],
})
export class InterviewModule {}
