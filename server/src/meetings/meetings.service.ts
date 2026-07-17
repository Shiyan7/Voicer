import { basename, extname } from 'path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingOutput } from './meeting.output';
import { MeetingEntity, MeetingStatus } from './meeting.entity';
import { FileStorageService } from '../file/file-storage.service';
import { FileUpload } from '../file/file-upload';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { TranscriptSegmentOutput } from './transcript-segment.output';
import { KeyPointEntity } from './key-point.entity';
import { KeyPointOutput } from './key-point.output';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    @InjectRepository(TranscriptSegmentEntity)
    private readonly transcriptSegmentsRepository: Repository<TranscriptSegmentEntity>,
    @InjectRepository(KeyPointEntity)
    private readonly keyPointsRepository: Repository<KeyPointEntity>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async createFromUpload(
    userId: string,
    upload: FileUpload,
  ): Promise<MeetingOutput> {
    if (!upload.mimetype.startsWith('audio/')) {
      throw new BadRequestException('Только аудиофайлы');
    }

    const audioUrl = await this.fileStorageService.save(userId, upload);

    const meeting = this.meetingsRepository.create({
      userId,
      title: this.titleFromFileName(upload.filename),
      source: 'upload',
      audioUrl,
      status: MeetingStatus.READY,
      startedAt: new Date(),
    });

    const saved = await this.meetingsRepository.save(meeting);

    return this.serialize(saved);
  }

  private titleFromFileName(fileName: string): string {
    return basename(fileName, extname(fileName)).trim() || 'Untitled meeting';
  }

  async getUserMeetings(userId: string): Promise<MeetingOutput[]> {
    const meetings = await this.meetingsRepository.find({
      where: { userId },
      order: { startedAt: 'DESC' },
      comment: this.getFnName(this.getUserMeetings.name),
    });

    return meetings.map(this.serialize);
  }

  async getMeetingById(userId: string, id: string): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);

    return this.serialize(meeting);
  }

  async getMeetingTranscript(
    userId: string,
    meetingId: string,
  ): Promise<TranscriptSegmentOutput[]> {
    await this.findOwnedMeeting(userId, meetingId);

    const segments = await this.transcriptSegmentsRepository.find({
      where: { meetingId },
      order: { startMs: 'ASC' },
      comment: this.getFnName(this.getMeetingTranscript.name),
    });

    return segments.map(this.serializeSegment);
  }

  async getMeetingKeyPoints(
    userId: string,
    meetingId: string,
  ): Promise<KeyPointOutput[]> {
    await this.findOwnedMeeting(userId, meetingId);

    const keyPoints = await this.keyPointsRepository.find({
      where: { meetingId },
      order: { order: 'ASC' },
      comment: this.getFnName(this.getMeetingKeyPoints.name),
    });

    return keyPoints.map(this.serializeKeyPoint);
  }

  async deleteMeeting(userId: string, id: string): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);
    const deleted = this.serialize(meeting);

    await this.meetingsRepository.remove(meeting);

    if (deleted.audioUrl) {
      await this.fileStorageService.remove(userId, deleted.audioUrl);
    }

    return deleted;
  }

  private async findOwnedMeeting(
    userId: string,
    id: string,
  ): Promise<MeetingEntity> {
    const meeting = await this.meetingsRepository.findOne({
      where: { id, userId },
      comment: this.getFnName(this.findOwnedMeeting.name),
    });

    if (!meeting) {
      throw new NotFoundException('Meeting не найден');
    }

    return meeting;
  }

  private serialize(meeting: MeetingEntity): MeetingOutput {
    return {
      id: meeting.id,
      title: meeting.title,
      source: meeting.source,
      audioUrl: meeting.audioUrl,
      status: meeting.status,
      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,
      durationSec: meeting.durationSec,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  private serializeSegment(
    segment: TranscriptSegmentEntity,
  ): TranscriptSegmentOutput {
    return {
      id: segment.id,
      meetingId: segment.meetingId,
      speakerIndex: segment.speakerIndex,
      startMs: segment.startMs,
      endMs: segment.endMs,
      text: segment.text,
    };
  }

  private serializeKeyPoint(keyPoint: KeyPointEntity): KeyPointOutput {
    return {
      id: keyPoint.id,
      meetingId: keyPoint.meetingId,
      text: keyPoint.text,
      atMs: keyPoint.atMs,
      order: keyPoint.order,
    };
  }

  private getFnName(name: string): string {
    return `${MeetingsService.name}.${name}`;
  }
}
