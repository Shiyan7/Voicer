import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { basename, extname, join } from 'path';
import { pipeline } from 'stream/promises';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from './file-upload';
import { transcodeToMp3 } from './transcode-to-mp3';

@Injectable()
export class FileStorageService {
  constructor(private readonly configService: ConfigService) {}

  private get storageDir(): string {
    return this.configService.get<string>('STORAGE_DIR');
  }

  private get publicBaseUrl(): string {
    return this.configService.get<string>('SERVER_URL');
  }

  async save(userId: string, upload: FileUpload): Promise<string> {
    const userDir = join(this.storageDir, userId);
    await mkdir(userDir, { recursive: true });

    const sourceName = `${randomUUID()}${this.resolveExtension(upload)}`;
    await pipeline(
      upload.createReadStream(),
      createWriteStream(join(userDir, sourceName)),
    );

    const playbackName = await this.ensurePlayable(userDir, sourceName);
    return `${this.publicBaseUrl}/storage/${userId}/${playbackName}`;
  }

  private async ensurePlayable(
    userDir: string,
    sourceName: string,
  ): Promise<string> {
    if (sourceName.endsWith('.mp3')) return sourceName;

    const mp3Name = `${randomUUID()}.mp3`;
    await transcodeToMp3(join(userDir, sourceName), join(userDir, mp3Name));
    await rm(join(userDir, sourceName), { force: true });
    return mp3Name;
  }

  resolveLocalPath(userId: string, fileUrl: string): string {
    return join(this.storageDir, userId, basename(fileUrl));
  }

  async remove(userId: string, fileUrl: string): Promise<void> {
    const fileName = basename(fileUrl);
    await rm(join(this.storageDir, userId, fileName), { force: true });
  }

  private resolveExtension(upload: FileUpload): string {
    const fromName = extname(upload.filename);
    if (fromName) return fromName;

    const fromMime = upload.mimetype.split('/')[1];
    return fromMime ? `.${fromMime}` : '';
  }
}
