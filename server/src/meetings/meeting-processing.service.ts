import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Repository } from 'typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { FileStorageService } from '../file/file-storage.service';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { SummarizationService } from '../summarization/summarization.service';
import {
  SummarizedActionItem,
  SummarizedKeyPoint,
} from '../summarization/summarization.types';
import { TranscriptionService } from '../transcription/transcription.service';
import { TranscribedSegment } from '../transcription/transcription.types';
import { KeyPointEntity } from './key-point.entity';
import { MeetingEntity, MeetingStatus } from './meeting.entity';
import { toMeetingOutput } from './meeting.serializer';
import { TranscriptSegmentEntity } from './transcript-segment.entity';

export const meetingUpdatedTopic = (meetingId: string): string =>
  `meetingUpdated.${meetingId}`;

@Injectable()
export class MeetingProcessingService {
  private readonly logger = new Logger(MeetingProcessingService.name);

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
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async updateAndPublish(
    meetingId: string,
    updates: Partial<MeetingEntity>,
  ): Promise<void> {
    await this.meetingsRepository.update(meetingId, updates);

    const meeting = await this.meetingsRepository.findOneBy({ id: meetingId });
    if (!meeting) return;

    await this.pubSub.publish(meetingUpdatedTopic(meetingId), {
      meetingUpdated: toMeetingOutput(meeting),
    });
  }

  async transcribe(meeting: MeetingEntity): Promise<void> {
    try {
      await this.saveTranscript(meeting);
    } catch (error) {
      this.logFailure(`Failed to process meeting ${meeting.id}`, error);
      await this.updateAndPublish(meeting.id, { status: MeetingStatus.FAILED });
    }
  }

  async summarize(meeting: MeetingEntity): Promise<void> {
    await this.updateAndPublish(meeting.id, {
      status: MeetingStatus.SUMMARIZING,
    });

    void this.runSummarization(meeting);
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

  private async runSummarization(meeting: MeetingEntity): Promise<void> {
    try {
      const segments = await this.getTranscribedSegments(meeting.id);
      const summary = await this.summarizationService.summarize(segments);
      await this.saveKeyPoints(meeting.id, summary.keyPoints);
      await this.saveActionItems(meeting, summary.actionItems);
    } catch (error) {
      this.logFailure(`Failed to summarize meeting ${meeting.id}`, error);
    } finally {
      await this.updateAndPublish(meeting.id, { status: MeetingStatus.READY });
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

  private logFailure(message: string, error: unknown): void {
    this.logger.error(
      message,
      error instanceof Error ? error.stack : String(error),
    );
  }
}
