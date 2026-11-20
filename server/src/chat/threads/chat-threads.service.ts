import { Injectable, NotFoundException } from '@nestjs/common';
import { requireText } from '../../common/require-text';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { MeetingContentService } from '../../meetings/meeting-content.service';
import { ChatThreadEntity } from './chat-thread.entity';

const MAX_THREADS = 100;
const MAX_TITLE_LENGTH = 120;

const toTitle = (question: string): string =>
  question.replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE_LENGTH);

@Injectable()
export class ChatThreadsService {
  constructor(
    @InjectRepository(ChatThreadEntity)
    private readonly threadsRepository: Repository<ChatThreadEntity>,
    private readonly meetingContent: MeetingContentService,
  ) {}

  async findOwned(userId: string, id: string): Promise<ChatThreadEntity> {
    const thread = await this.threadsRepository.findOneBy({ id, userId });
    if (!thread) throw new NotFoundException('Чат не найден');
    return thread;
  }

  async getMeetingThread(
    userId: string,
    meetingId: string,
  ): Promise<ChatThreadEntity> {
    await this.meetingContent.findOwned(userId, meetingId);
    await this.threadsRepository
      .createQueryBuilder()
      .insert()
      .values({ userId, meetingId })
      .orIgnore()
      .execute();

    return this.threadsRepository.findOneByOrFail({ meetingId });
  }

  getArchiveThreads(userId: string): Promise<ChatThreadEntity[]> {
    return this.threadsRepository.find({
      where: { userId, meetingId: IsNull() },
      order: { updatedAt: 'DESC' },
      take: MAX_THREADS,
    });
  }

  createArchiveThread(userId: string): Promise<ChatThreadEntity> {
    return this.threadsRepository.save(
      this.threadsRepository.create({ userId, meetingId: null }),
    );
  }

  async touch(thread: ChatThreadEntity, question: string): Promise<void> {
    await this.threadsRepository.update(thread.id, {
      title: thread.title ?? toTitle(question),
    });
  }

  async rename(
    userId: string,
    id: string,
    title: string,
  ): Promise<ChatThreadEntity> {
    const thread = await this.findOwned(userId, id);
    thread.title = toTitle(
      requireText(title, MAX_TITLE_LENGTH, 'Некорректное название'),
    );
    await this.threadsRepository.update(thread.id, {
      title: thread.title,
      updatedAt: thread.updatedAt,
    });
    return thread;
  }

  async delete(thread: ChatThreadEntity): Promise<void> {
    await this.threadsRepository.delete(thread.id);
  }
}
