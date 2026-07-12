import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  MEETING_AUDIO_UPLOADED_EVENT,
  MEETING_UPDATED_EVENT,
  MeetingAudioUploadedEvent,
  MeetingUpdatedEvent,
} from '../events/meeting.events';
import { MeetingEntity, MeetingStatus } from '../meetings/meeting.entity';
import { MeetingsService } from '../meetings/meetings.service';
import { StorageService } from '../storage/storage.service';
import { AudioService } from './audio.service';
import { isGeminiQuotaError, SummaryService } from './summary.service';
import { TranscriptionService } from './transcription.service';

const ERROR_MESSAGE_MAX_LENGTH = 500;

@Injectable()
export class ProcessingService implements OnModuleInit {
  private readonly logger = new Logger(ProcessingService.name);

  private readonly queue: string[] = [];
  private processing = false;

  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    private readonly meetingsService: MeetingsService,
    private readonly storageService: StorageService,
    private readonly audioService: AudioService,
    private readonly transcriptionService: TranscriptionService,
    private readonly summaryService: SummaryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Re-enqueue meetings stuck mid-pipeline after a server restart. */
  async onModuleInit(): Promise<void> {
    try {
      const stuck = await this.meetingsRepository.find({
        where: {
          status: In([
            MeetingStatus.UPLOADED,
            MeetingStatus.TRANSCRIBING,
            MeetingStatus.SUMMARIZING,
          ]),
        },
        order: { updatedAt: 'ASC' },
      });

      if (stuck.length > 0) {
        this.logger.log(`Re-enqueueing ${stuck.length} unfinished meeting(s)`);
        for (const meeting of stuck) {
          this.enqueue(meeting.id);
        }
      }
    } catch (e) {
      this.logger.error(`Failed to pick up unfinished meetings: ${e}`);
    }
  }

  @OnEvent(MEETING_AUDIO_UPLOADED_EVENT)
  onAudioUploaded(event: MeetingAudioUploadedEvent): void {
    this.enqueue(event.meetingId);
  }

  /** Adds a meeting to the FIFO queue; duplicates are ignored. */
  enqueue(meetingId: string): void {
    if (this.queue.includes(meetingId)) {
      return;
    }

    this.queue.push(meetingId);
    void this.drainQueue();
  }

  private async drainQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;
    try {
      while (this.queue.length > 0) {
        const meetingId = this.queue.shift();
        try {
          await this.process(meetingId);
        } catch (e) {
          // process() handles its own failures; this guards the loop itself.
          this.logger.error(`Unhandled pipeline error for ${meetingId}: ${e}`);
        }
      }
    } finally {
      this.processing = false;
    }
  }

  private async process(meetingId: string): Promise<void> {
    const meeting = await this.meetingsRepository.findOne({
      where: { id: meetingId },
    });

    if (!meeting) {
      this.logger.warn(`Meeting ${meetingId} not found, skipping`);
      return;
    }

    if (!meeting.audioPath) {
      await this.setStatus(meeting, MeetingStatus.FAILED, 'No audio attached');
      return;
    }

    this.logger.log(`Processing meeting ${meetingId}`);
    let workDir: string | null = null;

    try {
      await this.setStatus(meeting, MeetingStatus.TRANSCRIBING);

      const audioPath = this.storageService.getAbsolutePath(meeting.audioPath);
      workDir = await this.audioService.createWorkDir();

      const { leftPath, rightPath } = await this.audioService.splitChannels(
        audioPath,
        workDir,
      );
      const leftChunks = await this.audioService.chunk(leftPath, workDir, 'me');
      const rightChunks = await this.audioService.chunk(
        rightPath,
        workDir,
        'other',
      );

      const segments = await this.transcriptionService.transcribeAndSave(
        meeting.id,
        leftChunks,
        rightChunks,
      );

      await this.setStatus(meeting, MeetingStatus.SUMMARIZING);

      if (segments.length === 0) {
        this.logger.warn(`Meeting ${meetingId}: empty transcript, no summary`);
        await this.summaryService.clearSummary(meeting);
      } else {
        try {
          await this.summaryService.summarizeAndSave(meeting, segments);
        } catch (e) {
          if (!isGeminiQuotaError(e)) {
            throw e;
          }

          // Do not discard a successfully produced transcript merely because
          // Gemini has exhausted the project's quota. The meeting remains
          // readable and can be summarized again after quota is restored.
          this.logger.warn(
            `Meeting ${meetingId}: Gemini quota exhausted; saving transcript without summary`,
          );
          await this.summaryService.clearSummary(meeting);
        }
      }

      await this.setStatus(meeting, MeetingStatus.READY);
      this.logger.log(`Meeting ${meetingId} is ready`);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      this.logger.error(`Meeting ${meetingId} failed: ${message}`);
      await this.setStatus(
        meeting,
        MeetingStatus.FAILED,
        message.slice(0, ERROR_MESSAGE_MAX_LENGTH),
      );
    } finally {
      if (workDir) {
        await this.audioService.cleanup(workDir);
      }
    }
  }

  private async setStatus(
    meeting: MeetingEntity,
    status: MeetingStatus,
    errorMessage?: string,
  ): Promise<void> {
    await this.meetingsService.setStatus(meeting.id, status, errorMessage);

    const event: MeetingUpdatedEvent = {
      userId: meeting.userId,
      id: meeting.id,
      status,
    };
    this.eventEmitter.emit(MEETING_UPDATED_EVENT, event);
  }
}
