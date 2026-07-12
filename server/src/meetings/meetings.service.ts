import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MEETING_AUDIO_UPLOADED_EVENT,
  MEETING_UPDATED_EVENT,
  MeetingAudioUploadedEvent,
  MeetingUpdatedEvent,
} from '../events/meeting.events';
import { StorageService } from '../storage/storage.service';
import { CreateMeetingInput } from './dto/create-meeting.input';
import { UpdateMeetingInput } from './dto/update-meeting.input';
import { MeetingEntity, MeetingStatus } from './meeting.entity';

const MIMETYPE_TO_EXT: Record<string, string> = {
  'audio/flac': 'flac',
  'audio/x-flac': 'flac',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/wave': 'wav',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/m4a': 'm4a',
  'audio/aac': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/webm': 'webm',
};

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    private readonly storageService: StorageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    userId: string,
    input: CreateMeetingInput,
  ): Promise<MeetingEntity> {
    const meeting = this.meetingsRepository.create({
      userId,
      title: input.title ?? null,
      source: input.source,
      startedAt: new Date(input.startedAt),
    });

    return this.meetingsRepository.save(meeting);
  }

  async findAllByUser(
    userId: string,
    options?: { take?: number; skip?: number },
  ): Promise<MeetingEntity[]> {
    return this.meetingsRepository.find({
      where: { userId },
      order: { startedAt: 'DESC' },
      take: options?.take,
      skip: options?.skip,
    });
  }

  async findOneOwned(
    id: string,
    userId: string,
    withRelations = false,
  ): Promise<MeetingEntity> {
    const meeting = await this.meetingsRepository.findOne({
      where: { id },
      relations: withRelations
        ? { segments: true, actionItems: true }
        : undefined,
      order: withRelations ? { segments: { startMs: 'ASC' } } : undefined,
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    if (meeting.userId !== userId) {
      throw new ForbiddenException();
    }

    return meeting;
  }

  async update(
    id: string,
    userId: string,
    input: UpdateMeetingInput,
  ): Promise<MeetingEntity> {
    const meeting = await this.findOneOwned(id, userId);

    if (input.title !== undefined) {
      meeting.title = input.title;
    }

    if (input.endedAt !== undefined) {
      meeting.endedAt = new Date(input.endedAt);
    }

    if (input.durationSec !== undefined) {
      meeting.durationSec = input.durationSec;
    }

    return this.meetingsRepository.save(meeting);
  }

  async remove(id: string, userId: string): Promise<void> {
    const meeting = await this.findOneOwned(id, userId);

    if (meeting.audioPath) {
      await this.storageService.delete(meeting.audioPath);
    }

    await this.meetingsRepository.delete({ id });
  }

  async setStatus(
    id: string,
    status: MeetingStatus,
    errorMessage?: string,
  ): Promise<void> {
    await this.meetingsRepository.update(
      { id },
      { status, errorMessage: errorMessage ?? null },
    );
  }

  async attachAudio(
    id: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<MeetingEntity> {
    const meeting = await this.findOneOwned(id, userId);

    const ext = MIMETYPE_TO_EXT[file.mimetype] ?? 'flac';
    const audioPath = this.storageService.buildAudioPath(userId, id, ext);
    const { sizeBytes } = await this.storageService.save(
      audioPath,
      file.buffer,
    );

    if (meeting.audioPath && meeting.audioPath !== audioPath) {
      await this.storageService.delete(meeting.audioPath);
    }

    meeting.audioPath = audioPath;
    meeting.audioSizeBytes = sizeBytes;
    meeting.status = MeetingStatus.UPLOADED;
    meeting.errorMessage = null;

    const saved = await this.meetingsRepository.save(meeting);

    this.eventEmitter.emit(MEETING_UPDATED_EVENT, {
      userId,
      id: saved.id,
      status: saved.status,
    } satisfies MeetingUpdatedEvent);

    // Запуск пайплайна обработки (ProcessingService слушает это событие).
    this.eventEmitter.emit(MEETING_AUDIO_UPLOADED_EVENT, {
      meetingId: saved.id,
    } satisfies MeetingAudioUploadedEvent);

    return saved;
  }
}
