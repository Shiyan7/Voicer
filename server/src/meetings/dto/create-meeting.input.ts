import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { MeetingSource } from '../meeting.entity';

export class CreateMeetingInput {
  @IsOptional()
  @IsString()
  title?: string;

  @IsEnum(MeetingSource)
  source: MeetingSource;

  @IsDateString()
  startedAt: string;
}
