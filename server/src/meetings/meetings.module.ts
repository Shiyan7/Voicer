import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MeetingEntity } from './meeting.entity';
import { MeetingsResolver } from './meetings.resolver';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity]), AuthModule],
  providers: [MeetingsService, MeetingsResolver],
})
export class MeetingsModule {}
