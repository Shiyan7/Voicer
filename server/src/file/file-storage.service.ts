import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { basename, extname, join } from 'path';
import { pipeline } from 'stream/promises';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from './file-upload';

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
    const fileName = `${randomUUID()}${this.resolveExtension(upload)}`;
    const userDir = join(this.storageDir, userId);

    await mkdir(userDir, { recursive: true });
    await pipeline(
      upload.createReadStream(),
      createWriteStream(join(userDir, fileName)),
    );

    return `${this.publicBaseUrl}/storage/${userId}/${fileName}`;
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
