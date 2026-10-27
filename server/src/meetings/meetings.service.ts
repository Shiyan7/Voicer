import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { FindOptionsOrder, In, Repository } from 'typeorm';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { MeetingOutput } from './meeting.output';
import { MeetingsPageInput } from './meetings-page.input';
import { MeetingsPageOutput } from './meetings-page.output';
import { MeetingsSort } from './meetings-sort.enum';
import { MeetingEntity, MeetingStatus } from './meeting.entity';
import { FileStorageService } from '../file/file-storage.service';
import { FileUpload } from '../file/file-upload';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { TranscriptSegmentOutput } from './transcript-segment.output';
import { KeyPointEntity } from './key-point.entity';
import { KeyPointOutput } from './key-point.output';
import {
  meetingUpdatedTopic,
  MeetingProcessingService,
} from './meeting-processing.service';
import {
  toKeyPointOutput,
  toMeetingOutput,
  toSegmentOutput,
} from './meeting.serializer';

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
    private readonly processing: MeetingProcessingService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async *subscribeToMeetingUpdated(
    userId: string,
    meetingId: string,
  ): AsyncGenerator<{ meetingUpdated: MeetingOutput }> {
    const meeting = await this.findOwnedMeeting(userId, meetingId);

    yield { meetingUpdated: toMeetingOutput(meeting) };

    const updates = this.pubSub.asyncIterableIterator<{
      meetingUpdated: MeetingOutput;
    }>(meetingUpdatedTopic(meetingId)) as AsyncIterable<{
      meetingUpdated: MeetingOutput;
    }>;

    for await (const update of updates) {
      yield update;
    }
  }

  async createFromUpload(
    userId: string,
    upload: FileUpload,
    options: {
      source?: string;
      startedAt?: Date;
    } = {},
  ): Promise<MeetingOutput> {
    if (!upload.mimetype.startsWith('audio/')) {
      throw new BadRequestException('Только аудиофайлы');
    }

    const audioUrl = await this.fileStorageService.save(userId, upload);
    const { source, startedAt } = options;

    const meeting = this.meetingsRepository.create({
      userId,
      source: source || null,
      audioUrl,
      status: MeetingStatus.TRANSCRIBING,
      startedAt: startedAt ?? new Date(),
    });

    const saved = await this.meetingsRepository.save(meeting);

    void this.processing.transcribe(saved);

    return toMeetingOutput(saved);
  }

  async getUserMeetingsPage(
    userId: string,
    input: MeetingsPageInput,
  ): Promise<MeetingsPageOutput> {
    const page = Math.max(1, input.page);
    const skip = (page - 1) * input.limit;

    const [meetings, total] = await this.meetingsRepository.findAndCount({
      where: this.buildPageWhere(userId, input),
      order: this.buildPageOrder(input.sort),
      skip,
      take: input.limit,
      comment: this.getFnName(this.getUserMeetingsPage.name),
    });

    return {
      items: meetings.map(toMeetingOutput),
      meta: {
        page,
        total,
        hasNextItems: skip + meetings.length < total,
        hasPrevItems: page > 1,
      },
    };
  }

  private buildPageWhere(userId: string, input: MeetingsPageInput) {
    const base = input.favoritesOnly
      ? { userId, isFavorite: true }
      : { userId };

    if (!input.sources?.length) return base;

    return { ...base, source: In(input.sources) };
  }

  private buildPageOrder(sort: MeetingsSort): FindOptionsOrder<MeetingEntity> {
    switch (sort) {
      case MeetingsSort.DATE_ASC:
        return { startedAt: 'ASC', id: 'ASC' };
      case MeetingsSort.DURATION_DESC:
        return {
          durationSec: { direction: 'DESC', nulls: 'LAST' },
          startedAt: 'DESC',
          id: 'DESC',
        };
      case MeetingsSort.DURATION_ASC:
        return {
          durationSec: { direction: 'ASC', nulls: 'LAST' },
          startedAt: 'DESC',
          id: 'DESC',
        };
      default:
        return { startedAt: 'DESC', id: 'DESC' };
    }
  }

  async getMeetingById(userId: string, id: string): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);

    return toMeetingOutput(meeting);
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

    return segments.map(toSegmentOutput);
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

    return keyPoints.map(toKeyPointOutput);
  }

  async deleteMeeting(userId: string, id: string): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);
    const deleted = toMeetingOutput(meeting);

    await this.meetingsRepository.remove(meeting);

    if (deleted.audioUrl) {
      await this.fileStorageService.remove(userId, deleted.audioUrl);
    }

    return deleted;
  }

  async setMeetingFavorite(
    userId: string,
    id: string,
    isFavorite: boolean,
  ): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);

    await this.processing.updateAndPublish(meeting.id, { isFavorite });

    return toMeetingOutput({ ...meeting, isFavorite });
  }

  async summarizeMeeting(userId: string, id: string): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);

    if (meeting.status === MeetingStatus.SUMMARIZING) {
      return toMeetingOutput(meeting);
    }

    await this.processing.summarize(meeting);

    return toMeetingOutput({ ...meeting, status: MeetingStatus.SUMMARIZING });
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

  private getFnName(name: string): string {
    return `${MeetingsService.name}.${name}`;
  }
}
