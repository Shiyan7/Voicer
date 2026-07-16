import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { MeetingsResolver } from './meetings.resolver';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity])],
  providers: [MeetingsService, MeetingsResolver],
})
export class MeetingsModule {}
