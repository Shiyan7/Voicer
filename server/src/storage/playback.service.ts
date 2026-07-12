import { Injectable, Logger } from '@nestjs/common';
import { execFile } from 'child_process';
import { stat } from 'fs/promises';
import { extname } from 'path';
import { promisify } from 'util';
import { StorageService } from './storage.service';

const execFileAsync = promisify(execFile);

@Injectable()
export class PlaybackService {
  private readonly logger = new Logger(PlaybackService.name);
  private readonly conversions = new Map<string, Promise<string>>();

  constructor(private readonly storage: StorageService) {}

  async getPlaybackPath(audioPath: string): Promise<string> {
    if (extname(audioPath).toLowerCase() !== '.flac') {
      return audioPath;
    }

    const playbackPath = this.storage.buildPlaybackPath(audioPath);
    try {
      await stat(this.storage.getAbsolutePath(playbackPath));
      return playbackPath;
    } catch {}

    let conversion = this.conversions.get(audioPath);
    if (!conversion) {
      conversion = this.convertToMp3(audioPath, playbackPath).finally(() => {
        this.conversions.delete(audioPath);
      });
      this.conversions.set(audioPath, conversion);
    }

    return conversion;
  }

  private async convertToMp3(
    sourcePath: string,
    playbackPath: string,
  ): Promise<string> {
    this.logger.log(`Creating playback MP3 for ${sourcePath}`);
    await execFileAsync('ffmpeg', [
      '-y',
      '-i',
      this.storage.getAbsolutePath(sourcePath),
      '-map',
      '0:a:0',
      '-vn',
      '-c:a',
      'libmp3lame',
      '-q:a',
      '4',
      this.storage.getAbsolutePath(playbackPath),
    ]);
    return playbackPath;
  }
}
