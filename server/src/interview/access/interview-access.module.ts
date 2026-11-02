import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewSessionEntity } from '../interview-session.entity';
import { InterviewAccessService } from './interview-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSessionEntity])],
  providers: [InterviewAccessService],
  exports: [InterviewAccessService],
})
export class InterviewAccessModule {}
