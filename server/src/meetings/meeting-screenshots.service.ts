import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from '../file/file-upload';
import { FileStorageService } from '../file/file-storage.service';
import { readUpload } from '../file/read-upload';
import { MeetingContentService } from './meeting-content.service';
import { MeetingScreenshotEntity } from './meeting-screenshot.entity';
import { MeetingScreenshotOutput } from './meeting-screenshot.output';

const MAX_SCREENSHOT_BYTES = 15 * 1024 * 1024;
const SCREENSHOT_EXTENSION = '.jpg';
const THUMBNAIL_WIDTH = 480;

@Injectable()
export class MeetingScreenshotsService {
  constructor(
    @InjectRepository(MeetingScreenshotEntity)
    private readonly screenshotsRepository: Repository<MeetingScreenshotEntity>,
    private readonly content: MeetingContentService,
    private readonly fileStorage: FileStorageService,
  ) {}

  async list(
    userId: string,
    meetingId: string,
  ): Promise<MeetingScreenshotOutput[]> {
    await this.content.findOwned(userId, meetingId);
    const screenshots = await this.screenshotsRepository.find({
      where: { meetingId },
      order: { offsetMs: 'ASC' },
    });
    return screenshots.map((screenshot) => this.toOutput(screenshot));
  }

  async add(
    userId: string,
    meetingId: string,
    upload: FileUpload,
    offsetMs: number,
  ): Promise<MeetingScreenshotOutput> {
    await this.content.findOwned(userId, meetingId);
    if (!upload.mimetype.startsWith('image/')) {
      throw new BadRequestException('Скриншот должен быть изображением');
    }
    const data = await readUpload(upload, MAX_SCREENSHOT_BYTES);
    const url = await this.fileStorage.saveBuffer(
      userId,
      data,
      SCREENSHOT_EXTENSION,
    );
    const thumbUrl = await this.fileStorage.saveThumbnail(
      userId,
      url,
      THUMBNAIL_WIDTH,
    );
    const screenshot = await this.screenshotsRepository.save(
      this.screenshotsRepository.create({
        meetingId,
        offsetMs: Math.max(0, Math.round(offsetMs)),
        url,
        thumbUrl,
      }),
    );
    return this.toOutput(screenshot);
  }

  async removeFiles(userId: string, meetingId: string): Promise<void> {
    const screenshots = await this.screenshotsRepository.findBy({ meetingId });
    await Promise.all(
      screenshots.flatMap(({ url, thumbUrl }) =>
        [url, thumbUrl]
          .filter((fileUrl): fileUrl is string => !!fileUrl)
          .map((fileUrl) => this.fileStorage.remove(userId, fileUrl)),
      ),
    );
  }

  private toOutput(
    screenshot: MeetingScreenshotEntity,
  ): MeetingScreenshotOutput {
    return {
      id: screenshot.id,
      offsetMs: screenshot.offsetMs,
      url: this.fileStorage.signUrl(screenshot.url),
      thumbUrl: this.fileStorage.signUrl(screenshot.thumbUrl ?? screenshot.url),
    };
  }
}
