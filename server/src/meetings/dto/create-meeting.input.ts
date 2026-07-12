import {
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { MeetingSource } from '../meeting.entity';

export class CreateMeetingInput {
  @IsOptional()
  @IsString()
  title?: string;

  @IsEnum(MeetingSource)
  source: MeetingSource;

  @IsDateString()
  startedAt: string;

  @IsOptional()
  @IsIn(['ru', 'en'])
  language?: string;
}
