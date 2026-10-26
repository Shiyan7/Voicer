import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MeetingsService } from '../src/meetings/meetings.service';
import { Repository } from 'typeorm';
import { MeetingEntity, MeetingStatus } from '../src/meetings/meeting.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function retryMeeting(meetingId: string) {
  const app = await NestFactory.createApplicationContext(AppModule);

  const meetingsRepository = app.get<Repository<MeetingEntity>>(
    getRepositoryToken(MeetingEntity),
  );

  const meeting = await meetingsRepository.findOne({
    where: { id: meetingId },
  });

  if (!meeting) {
    console.error('Meeting not found');
    process.exit(1);
  }

  console.log(`Found meeting: ${meeting.id}, status: ${meeting.status}`);

  meeting.status = MeetingStatus.TRANSCRIBING;
  await meetingsRepository.save(meeting);

  console.log('Status updated to TRANSCRIBING');

  const meetingsService = app.get(MeetingsService);

  console.log('Starting transcription...');
  await (meetingsService as any).processMeeting(meeting);

  console.log('Done!');
  await app.close();
}

const meetingId = process.argv[2];
if (!meetingId) {
  console.error('Usage: npm run retry-meeting <meetingId>');
  process.exit(1);
}

retryMeeting(meetingId).catch(console.error);
