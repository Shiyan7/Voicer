import { FileModule } from '../file/file.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GeminiModule } from '../gemini/gemini.module';
import { ClaudeModule } from '../claude/claude.module';
import { InterviewAnswersService } from './interview-answers.service';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewTurnEntity } from './interview-turn.entity';
import { MeetingsModule } from '../meetings/meetings.module';
import { InterviewSessionsService } from './interview-sessions.service';
import { InterviewResolver } from './interview.resolver';
import { LiveAudioGateway } from './live/live-audio.gateway';
import { TranscriptionModule } from '../transcription/transcription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterviewSessionEntity, InterviewTurnEntity]),
    MeetingsModule,
    FileModule,
    AuthModule,
    GeminiModule,
    ClaudeModule,
    TranscriptionModule,
  ],
  providers: [
    InterviewSessionsService,
    InterviewAnswersService,
    InterviewResolver,
    LiveAudioGateway,
  ],
})
export class InterviewModule {}
