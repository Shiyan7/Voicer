import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import {
  And,
  FindOperator,
  FindOptionsOrder,
  In,
  IsNull,
  LessThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
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
import { SummaryStyle } from '../summarization/summary-style.enum';
import { InterviewAccessService } from '../interview/access/interview-access.service';
import { MeetingContentService } from './meeting-content.service';
import { MeetingRecording } from './meeting-recording';
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

const MAX_TITLE_LENGTH = 120;
const MAX_PAGE_LIMIT = 100;

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    @InjectRepository(TranscriptSegmentEntity)
    private readonly transcriptSegmentsRepository: Repository<TranscriptSegmentEntity>,
    @InjectRepository(KeyPointEntity)
    private readonly keyPointsRepository: Repository<KeyPointEntity>,
    private readonly interviewAccess: InterviewAccessService,
    private readonly content: MeetingContentService,
    private readonly fileStorageService: FileStorageService,
    private readonly processing: MeetingProcessingService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async subscribeToMeetingUpdated(
    userId: string,
    meetingId: string,
  ): Promise<AsyncGenerator<{ meetingUpdated: MeetingOutput }>> {
    const meeting = await this.findOwnedMeeting(userId, meetingId);

    return this.streamMeetingUpdates(meeting);
  }

  private async *streamMeetingUpdates(
    meeting: MeetingEntity,
  ): AsyncGenerator<{ meetingUpdated: MeetingOutput }> {
    yield { meetingUpdated: toMeetingOutput(meeting) };

    const updates = this.pubSub.asyncIterableIterator<{
      meetingUpdated: MeetingOutput;
    }>(meetingUpdatedTopic(meeting.id)) as AsyncIterable<{
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
      interviewSessionId?: string;
    } = {},
  ): Promise<MeetingOutput> {
    if (!upload.mimetype.startsWith('audio/')) {
      throw new BadRequestException('Только аудиофайлы');
    }

    const interviewSessionId = await this.resolveInterviewSessionId(
      userId,
      options.interviewSessionId,
    );
    const audioUrl = await this.fileStorageService.save(userId, upload);

    const meeting = this.meetingsRepository.create({
      userId,
      source: options.source || null,
      audioUrl,
      status: MeetingStatus.TRANSCRIBING,
      startedAt: options.startedAt ?? new Date(),
      interviewSessionId,
    });

    const saved = await this.saveOrRemoveFile(userId, meeting);

    void this.processing.transcribe(saved);

    return toMeetingOutput(saved);
  }

  async findInterviewRecordings(
    sessionIds: string[],
  ): Promise<MeetingRecording[]> {
    const recordings = await this.meetingsRepository
      .createQueryBuilder('meeting')
      .distinctOn(['meeting.interviewSessionId'])
      .select('meeting.id', 'id')
      .addSelect('meeting.audioUrl', 'audioUrl')
      .addSelect('meeting.interviewSessionId', 'sessionId')
      .where({ interviewSessionId: In(sessionIds) })
      .orderBy('meeting.interviewSessionId')
      .addOrderBy('meeting.durationSec', 'DESC', 'NULLS LAST')
      .getRawMany<MeetingRecording>();
    return recordings.map((recording) => ({
      ...recording,
      audioUrl: this.fileStorageService.signUrl(recording.audioUrl),
    }));
  }

  signAudioUrl(audioUrl: string | null): string | null {
    return this.fileStorageService.signUrl(audioUrl);
  }

  private async saveOrRemoveFile(
    userId: string,
    meeting: MeetingEntity,
  ): Promise<MeetingEntity> {
    try {
      return await this.meetingsRepository.save(meeting);
    } catch (error) {
      await this.fileStorageService.remove(userId, meeting.audioUrl);
      throw error;
    }
  }

  private async resolveInterviewSessionId(
    userId: string,
    id?: string,
  ): Promise<string | null> {
    if (!id) return null;
    const isOwned = await this.interviewAccess.isOwned(userId, id);
    if (!isOwned) throw new NotFoundException('Сессия не найдена');
    return id;
  }

  async getUserMeetingsPage(
    userId: string,
    input: MeetingsPageInput,
  ): Promise<MeetingsPageOutput> {
    const page = Math.max(1, input.page);
    const limit = Math.min(Math.max(1, input.limit), MAX_PAGE_LIMIT);
    const skip = (page - 1) * limit;

    const [meetings, total] = await this.meetingsRepository.findAndCount({
      where: this.buildPageWhere(userId, input),
      order: this.buildPageOrder(input.sort),
      skip,
      take: limit,
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
    const owned = { userId, interviewSessionId: IsNull() };
    const base = input.favoritesOnly ? { ...owned, isFavorite: true } : owned;
    const startedAt = this.buildStartedAtRange(input.from, input.to);
    const ranged = startedAt ? { ...base, startedAt } : base;

    if (!input.sources?.length) return ranged;

    return { ...ranged, source: In(input.sources) };
  }

  private buildStartedAtRange(
    from?: Date | null,
    to?: Date | null,
  ): FindOperator<Date> | null {
    if (from && to) return And(MoreThanOrEqual(from), LessThan(to));
    if (from) return MoreThanOrEqual(from);
    if (to) return LessThan(to);
    return null;
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

  async getMeeting(userId: string, id: string): Promise<MeetingOutput> {
    return toMeetingOutput(await this.findOwnedMeeting(userId, id));
  }

  async getMeetingTranscript(
    userId: string,
    meetingId: string,
  ): Promise<TranscriptSegmentOutput[]> {
    await this.findOwnedMeeting(userId, meetingId);

    const segments = await this.transcriptSegmentsRepository.find({
      where: { meetingId },
      order: { startMs: 'ASC' },
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

  async renameMeeting(
    userId: string,
    id: string,
    title: string | null,
  ): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);
    const normalized = title?.trim().slice(0, MAX_TITLE_LENGTH) || null;

    await this.processing.updateAndPublish(meeting.id, { title: normalized });

    return toMeetingOutput({ ...meeting, title: normalized });
  }

  async suggestMeetingTitle(userId: string, id: string): Promise<string> {
    const meeting = await this.findOwnedMeeting(userId, id);

    return this.processing.suggestTitle(meeting.id);
  }

  async summarizeMeeting(
    userId: string,
    id: string,
    style: SummaryStyle,
  ): Promise<MeetingOutput> {
    const meeting = await this.findOwnedMeeting(userId, id);

    if (meeting.status === MeetingStatus.SUMMARIZING) {
      return toMeetingOutput(meeting);
    }

    await this.processing.summarize(meeting, style);

    return toMeetingOutput({
      ...meeting,
      status: MeetingStatus.SUMMARIZING,
      summaryStyle: style,
    });
  }

  private findOwnedMeeting(userId: string, id: string): Promise<MeetingEntity> {
    return this.content.findOwned(userId, id);
  }
}
