import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { EntityManager, In, IsNull, Repository } from 'typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { FileStorageService } from '../file/file-storage.service';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { SummarizationService } from '../summarization/summarization.service';
import { SummaryStyle } from '../summarization/summary-style.enum';
import {
  SummarizedActionItem,
  SummarizedKeyPoint,
} from '../summarization/summarization.types';
import { TranscriptionService } from '../transcription/transcription.service';
import { TranscribedSegment } from '../transcription/transcription.types';
import { KeyPointEntity } from './key-point.entity';
import { MeetingEntity, MeetingStatus } from './meeting.entity';
import { MeetingOutput } from './meeting.output';
import { toMeetingOutput } from './meeting.serializer';
import { TranscriptSegmentEntity } from './transcript-segment.entity';

export const meetingUpdatedTopic = (meetingId: string): string =>
  `meetingUpdated.${meetingId}`;

@Injectable()
export class MeetingProcessingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MeetingProcessingService.name);

  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    @InjectRepository(TranscriptSegmentEntity)
    private readonly transcriptSegmentsRepository: Repository<TranscriptSegmentEntity>,
    private readonly fileStorageService: FileStorageService,
    private readonly transcriptionService: TranscriptionService,
    private readonly summarizationService: SummarizationService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const interrupted = await this.meetingsRepository.find({
      where: {
        status: In([MeetingStatus.TRANSCRIBING, MeetingStatus.SUMMARIZING]),
      },
    });

    for (const meeting of interrupted) {
      this.logger.warn(`Resuming interrupted meeting ${meeting.id}`);
      void this.resume(meeting);
    }
  }

  private async resume(meeting: MeetingEntity): Promise<void> {
    if (meeting.status === MeetingStatus.TRANSCRIBING) {
      await this.transcriptSegmentsRepository.delete({ meetingId: meeting.id });
      await this.transcribe(meeting);
      return;
    }

    const hasNotes = await this.meetingsRepository.manager.exists(
      KeyPointEntity,
      { where: { meetingId: meeting.id } },
    );
    await this.runSummarization({
      ...meeting,
      status: hasNotes ? MeetingStatus.READY : MeetingStatus.TRANSCRIBED,
    });
  }

  async updateAndPublish(
    meetingId: string,
    updates: Partial<MeetingEntity>,
    events: Partial<MeetingOutput> = {},
  ): Promise<void> {
    await this.meetingsRepository.update(meetingId, updates);

    const meeting = await this.meetingsRepository.findOneBy({ id: meetingId });
    if (!meeting) return;

    await this.pubSub.publish(meetingUpdatedTopic(meetingId), {
      meetingUpdated: { ...toMeetingOutput(meeting), ...events },
    });
  }

  async transcribe(meeting: MeetingEntity): Promise<void> {
    try {
      await this.saveTranscript(meeting);
    } catch (error) {
      if (await this.isDeleted(meeting.id)) return;
      this.logFailure(`Failed to process meeting ${meeting.id}`, error);
      await this.updateAndPublish(meeting.id, { status: MeetingStatus.FAILED });
    }
  }

  async summarize(meeting: MeetingEntity, style: SummaryStyle): Promise<void> {
    await this.updateAndPublish(meeting.id, {
      status: MeetingStatus.SUMMARIZING,
      summaryStyle: style,
    });

    void this.runSummarization({ ...meeting, summaryStyle: style });
  }

  private async saveTranscript(meeting: MeetingEntity): Promise<void> {
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

    const lastSegment = segments[segments.length - 1];
    await this.updateAndPublish(meeting.id, {
      status: MeetingStatus.TRANSCRIBED,
      endedAt: new Date(),
      durationSec: lastSegment ? Math.round(lastSegment.endMs / 1000) : null,
    });
  }

  async suggestTitle(meetingId: string): Promise<string> {
    const segments = await this.getTranscribedSegments(meetingId);
    if (!segments.length) return '';

    return this.summarizationService.generateTitle(segments);
  }

  private async saveTitleIfEmpty(
    manager: EntityManager,
    meetingId: string,
    title: string,
  ): Promise<void> {
    if (!title) return;

    await manager.update(
      MeetingEntity,
      { id: meetingId, title: IsNull() },
      { title },
    );
  }

  private async runSummarization(meeting: MeetingEntity): Promise<void> {
    try {
      const segments = await this.getTranscribedSegments(meeting.id);
      const summary = await this.summarizationService.summarize(
        segments,
        meeting.summaryStyle ?? SummaryStyle.AUTO,
      );
      await this.meetingsRepository.manager.transaction(async (manager) => {
        await this.saveTitleIfEmpty(manager, meeting.id, summary.title);
        await this.saveKeyPoints(manager, meeting.id, summary.keyPoints);
        await this.saveActionItems(manager, meeting, summary.actionItems);
      });
      await this.updateAndPublish(meeting.id, { status: MeetingStatus.READY });
    } catch (error) {
      if (await this.isDeleted(meeting.id)) return;
      this.logFailure(`Failed to summarize meeting ${meeting.id}`, error);
      await this.updateAndPublish(
        meeting.id,
        { status: meeting.status },
        { summarizationFailed: true },
      );
    }
  }

  private async getTranscribedSegments(
    meetingId: string,
  ): Promise<TranscribedSegment[]> {
    const segments = await this.transcriptSegmentsRepository.find({
      where: { meetingId },
      order: { startMs: 'ASC' },
    });

    return segments.map(({ speakerIndex, startMs, endMs, text }) => ({
      speakerIndex,
      startMs,
      endMs,
      text,
    }));
  }

  private async saveKeyPoints(
    manager: EntityManager,
    meetingId: string,
    keyPoints: SummarizedKeyPoint[],
  ): Promise<void> {
    await manager.delete(KeyPointEntity, { meetingId });
    await manager.save(
      keyPoints.map((keyPoint, index) =>
        manager.create(KeyPointEntity, {
          meetingId,
          text: keyPoint.text,
          atMs: keyPoint.atMs,
          order: index,
        }),
      ),
    );
  }

  private async saveActionItems(
    manager: EntityManager,
    meeting: MeetingEntity,
    actionItems: SummarizedActionItem[],
  ): Promise<void> {
    await manager.delete(ActionItemEntity, { meetingId: meeting.id });
    await manager.save(
      actionItems.map((actionItem) =>
        manager.create(ActionItemEntity, {
          meetingId: meeting.id,
          userId: meeting.userId,
          text: actionItem.text,
          atMs: actionItem.atMs,
          speakerIndex: actionItem.speakerIndex,
        }),
      ),
    );
  }

  private async isDeleted(meetingId: string): Promise<boolean> {
    return !(await this.meetingsRepository.existsBy({ id: meetingId }));
  }

  private logFailure(message: string, error: unknown): void {
    this.logger.error(
      message,
      error instanceof Error ? error.stack : String(error),
    );
  }
}
