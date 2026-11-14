import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { basename, extname, join, resolve } from 'path';
import { pipeline } from 'stream/promises';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from './file-upload';
import { makeThumbnail } from './make-thumbnail';
import { isFileSignatureValid, signFileUrl } from './signed-url';
import { transcodeToMp3 } from './transcode-to-mp3';

const DEFAULT_STORAGE_DIR = './storage';

@Injectable()
export class FileStorageService {
  constructor(private readonly configService: ConfigService) {}

  private get storageDir(): string {
    return this.configService.get<string>('STORAGE_DIR') ?? DEFAULT_STORAGE_DIR;
  }

  private get publicBaseUrl(): string {
    return this.configService.get<string>('SERVER_URL');
  }

  private get signingSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
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
    return this.toPublicUrl(userId, playbackName);
  }

  async saveBuffer(
    userId: string,
    data: Buffer,
    extension: string,
  ): Promise<string> {
    const userDir = join(this.storageDir, userId);
    await mkdir(userDir, { recursive: true });

    const fileName = `${randomUUID()}${extension}`;
    await writeFile(join(userDir, fileName), data);
    return this.toPublicUrl(userId, fileName);
  }

  async saveThumbnail(
    userId: string,
    sourceUrl: string,
    width: number,
  ): Promise<string> {
    const fileName = `${randomUUID()}.jpg`;
    await makeThumbnail(
      this.resolveLocalPath(userId, sourceUrl),
      join(this.storageDir, userId, fileName),
      width,
    );
    return this.toPublicUrl(userId, fileName);
  }

  private toPublicUrl(userId: string, fileName: string): string {
    return `${this.publicBaseUrl}/storage/${userId}/${fileName}`;
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

  signUrl(fileUrl: string | null): string | null {
    return (
      fileUrl && signFileUrl(this.signingSecret, this.toCurrentOrigin(fileUrl))
    );
  }

  private toCurrentOrigin(fileUrl: string): string {
    const { pathname } = new URL(fileUrl);
    return new URL(pathname, this.publicBaseUrl).toString();
  }

  isSigned(path: string, expires: string, signature: string): boolean {
    return isFileSignatureValid(this.signingSecret, path, expires, signature);
  }

  resolveAbsolutePath(userId: string, fileName: string): string {
    return resolve(this.storageDir, basename(userId), basename(fileName));
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
