import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream, ReadStream, Stats } from 'fs';
import { mkdir, rm, stat, writeFile } from 'fs/promises';
import { dirname, extname, join, resolve } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export interface ReadStreamOptions {
  start?: number;
  end?: number;
}

@Injectable()
export class StorageService {
  private readonly rootDir: string;

  constructor(configService: ConfigService) {
    this.rootDir = resolve(
      configService.get<string>('STORAGE_DIR') || './storage',
    );
  }

  buildAudioPath(userId: string, meetingId: string, ext: string): string {
    return join(userId, `${meetingId}.${ext}`);
  }

  buildPlaybackPath(audioPath: string): string {
    return `${audioPath.slice(0, -extname(audioPath).length)}.playback.mp3`;
  }

  getAbsolutePath(relativePath: string): string {
    return join(this.rootDir, relativePath);
  }

  async save(
    relativePath: string,
    data: Buffer | Readable,
  ): Promise<{ sizeBytes: number }> {
    const absolutePath = this.getAbsolutePath(relativePath);
    await mkdir(dirname(absolutePath), { recursive: true });

    if (Buffer.isBuffer(data)) {
      await writeFile(absolutePath, data);
    } else {
      await pipeline(data, createWriteStream(absolutePath));
    }

    const stats = await stat(absolutePath);
    return { sizeBytes: stats.size };
  }

  getReadStream(relativePath: string, options?: ReadStreamOptions): ReadStream {
    return createReadStream(this.getAbsolutePath(relativePath), options);
  }

  async stat(relativePath: string): Promise<Stats> {
    return stat(this.getAbsolutePath(relativePath));
  }

  async delete(relativePath: string): Promise<void> {
    await rm(this.getAbsolutePath(relativePath), { force: true });

    if (extname(relativePath).toLowerCase() === '.flac') {
      await rm(this.getAbsolutePath(this.buildPlaybackPath(relativePath)), {
        force: true,
      });
    }
  }
}
