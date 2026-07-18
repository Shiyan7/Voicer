import { basename, extname } from 'path';
import {
  BadRequestException,
  Injectable,
  Logger,
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
import { ActionItemEntity } from '../actions/action-item.entity';
import { TranscriptionService } from '../transcription/transcription.service';
import { TranscribedSegment } from '../transcription/transcription.types';
import { SummarizationService } from '../summarization/summarization.service';
import {
  SummarizedActionItem,
  SummarizedKeyPoint,
} from '../summarization/summarization.types';

@Injectable()
export class MeetingsService {
  private readonly logger = new Logger(MeetingsService.name);

  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    @InjectRepository(TranscriptSegmentEntity)
    private readonly transcriptSegmentsRepository: Repository<TranscriptSegmentEntity>,
    @InjectRepository(KeyPointEntity)
    private readonly keyPointsRepository: Repository<KeyPointEntity>,
    @InjectRepository(ActionItemEntity)
    private readonly actionItemsRepository: Repository<ActionItemEntity>,
    private readonly fileStorageService: FileStorageService,
    private readonly transcriptionService: TranscriptionService,
    private readonly summarizationService: SummarizationService,
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
      status: MeetingStatus.TRANSCRIBING,
      startedAt: new Date(),
    });

    const saved = await this.meetingsRepository.save(meeting);

    void this.processMeeting(saved);

    return this.serialize(saved);
  }

  private async processMeeting(meeting: MeetingEntity): Promise<void> {
    try {
      const segments = await this.transcribeMeeting(meeting);
      await this.summarizeMeeting(meeting, segments);
    } catch (error) {
      this.logger.error(
        `Failed to process meeting ${meeting.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.meetingsRepository.update(meeting.id, {
        status: MeetingStatus.FAILED,
      });
    }
  }

  private async transcribeMeeting(
    meeting: MeetingEntity,
  ): Promise<TranscribedSegment[]> {
    const filePath = this.fileStorageService.resolveLocalPath(
      meeting.userId,
      meeting.audioUrl,
    );

    const segments = await this.transcriptionService.transcribeAudio(filePath);

    await this.transcriptSegmentsRepository.save(
      segments.map((segment) =>
        this.transcriptSegmentsRepository.create({
          meetingId: meeting.id,
          ...segment,
        }),
      ),
    );

    const lastSegment = segments.at(-1);
    await this.meetingsRepository.update(meeting.id, {
      status: MeetingStatus.SUMMARIZING,
      endedAt: new Date(),
      durationSec: lastSegment ? Math.round(lastSegment.endMs / 1000) : null,
    });

    return segments;
  }

  private async summarizeMeeting(
    meeting: MeetingEntity,
    segments: TranscribedSegment[],
  ): Promise<void> {
    try {
      const summary = await this.summarizationService.summarize(segments);
      await this.saveKeyPoints(meeting.id, summary.keyPoints);
      await this.saveActionItems(meeting, summary.actionItems);
    } catch (error) {
      this.logger.error(
        `Failed to summarize meeting ${meeting.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      await this.meetingsRepository.update(meeting.id, {
        status: MeetingStatus.READY,
      });
    }
  }

  private async saveKeyPoints(
    meetingId: string,
    keyPoints: SummarizedKeyPoint[],
  ): Promise<void> {
    await this.keyPointsRepository.delete({ meetingId });
    await this.keyPointsRepository.save(
      keyPoints.map((keyPoint, index) =>
        this.keyPointsRepository.create({
          meetingId,
          text: keyPoint.text,
          atMs: keyPoint.atMs,
          order: index,
        }),
      ),
    );
  }

  private async saveActionItems(
    meeting: MeetingEntity,
    actionItems: SummarizedActionItem[],
  ): Promise<void> {
    await this.actionItemsRepository.delete({ meetingId: meeting.id });
    await this.actionItemsRepository.save(
      actionItems.map((actionItem) =>
        this.actionItemsRepository.create({
          meetingId: meeting.id,
          userId: meeting.userId,
          text: actionItem.text,
          atMs: actionItem.atMs,
          speakerIndex: actionItem.speakerIndex,
        }),
      ),
    );
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
