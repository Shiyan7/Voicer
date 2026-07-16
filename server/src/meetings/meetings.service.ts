import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingOutput } from './meeting.output';
import { MeetingEntity } from './meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
  ) {}

  async getUserMeetings(userId: string): Promise<MeetingOutput[]> {
    const meetings = await this.meetingsRepository.find({
      where: { userId },
      order: { startedAt: 'DESC' },
      comment: this.getFnName(this.getUserMeetings.name),
    });

    return meetings.map(this.serialize);
  }

  private serialize(meeting: MeetingEntity): MeetingOutput {
    return {
      id: meeting.id,
      title: meeting.title,
      source: meeting.source,
      status: meeting.status,
      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,
      durationSec: meeting.durationSec,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  private getFnName(name: string): string {
    return `${MeetingsService.name}.${name}`;
  }
}
