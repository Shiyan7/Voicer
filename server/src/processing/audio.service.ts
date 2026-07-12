import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { execFile } from 'child_process';
import { mkdtemp, readdir, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const EXEC_OPTIONS = { maxBuffer: 16 * 1024 * 1024 };

/** Chunk length keeping mono 16kHz FLAC well under Groq's 25MB file limit. */
const CHUNK_SECONDS = 600;

export interface SplitChannelsResult {
  /** Left channel (the user, speaker 'me'), mono 16kHz FLAC. */
  leftPath: string;
  /** Right channel (the other party), mono 16kHz FLAC. */
  rightPath: string;
}

export interface AudioChunk {
  path: string;
  /** Absolute offset of this chunk from the start of the recording. */
  offsetMs: number;
}

@Injectable()
export class AudioService implements OnModuleInit {
  private readonly logger = new Logger(AudioService.name);
  private ffmpegAvailable = false;

  async onModuleInit(): Promise<void> {
    try {
      await execFileAsync('ffmpeg', ['-version'], EXEC_OPTIONS);
      await execFileAsync('ffprobe', ['-version'], EXEC_OPTIONS);
      this.ffmpegAvailable = true;
    } catch {
      this.logger.error(
        '!!! ffmpeg/ffprobe not found in PATH — audio processing WILL FAIL. ' +
          'Install it (macOS: brew install ffmpeg) and restart the server. !!!',
      );
    }
  }

  async createWorkDir(): Promise<string> {
    return mkdtemp(join(tmpdir(), 'voicer-'));
  }

  /**
   * Splits a stereo recording into two mono 16kHz FLAC files:
   * left = 'me', right = 'other'.
   */
  async splitChannels(
    inputPath: string,
    workDir: string,
  ): Promise<SplitChannelsResult> {
    this.assertFfmpeg();

    const leftPath = join(workDir, 'left.flac');
    const rightPath = join(workDir, 'right.flac');

    await execFileAsync(
      'ffmpeg',
      [
        '-y',
        '-i',
        inputPath,
        '-filter_complex',
        '[0:a]channelsplit=channel_layout=stereo[left][right]',
        '-map',
        '[left]',
        '-ar',
        '16000',
        '-c:a',
        'flac',
        leftPath,
        '-map',
        '[right]',
        '-ar',
        '16000',
        '-c:a',
        'flac',
        rightPath,
      ],
      EXEC_OPTIONS,
    );

    return { leftPath, rightPath };
  }

  /**
   * Cuts a mono file into ≤10-minute FLAC segments and returns them in order
   * with their absolute time offsets (accumulated from probed durations).
   */
  async chunk(
    inputPath: string,
    workDir: string,
    prefix: string,
  ): Promise<AudioChunk[]> {
    this.assertFfmpeg();

    await execFileAsync(
      'ffmpeg',
      [
        '-y',
        '-i',
        inputPath,
        '-f',
        'segment',
        '-segment_time',
        String(CHUNK_SECONDS),
        '-segment_format',
        'flac',
        '-c:a',
        'flac',
        join(workDir, `${prefix}-%04d.flac`),
      ],
      EXEC_OPTIONS,
    );

    const files = (await readdir(workDir))
      .filter((name) => name.startsWith(`${prefix}-`) && name.endsWith('.flac'))
      .sort();

    const chunks: AudioChunk[] = [];
    let offsetMs = 0;

    for (const name of files) {
      const path = join(workDir, name);
      chunks.push({ path, offsetMs });
      offsetMs += await this.probeDurationMs(path);
    }

    return chunks;
  }

  async probeDurationMs(path: string): Promise<number> {
    this.assertFfmpeg();

    const { stdout } = await execFileAsync(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'csv=p=0',
        path,
      ],
      EXEC_OPTIONS,
    );

    const seconds = parseFloat(stdout.trim());
    if (Number.isNaN(seconds)) {
      throw new Error(`ffprobe returned no duration for ${path}`);
    }

    return Math.round(seconds * 1000);
  }

  async cleanup(workDir: string): Promise<void> {
    try {
      await rm(workDir, { recursive: true, force: true });
    } catch (e) {
      this.logger.warn(`Failed to clean up temp dir ${workDir}: ${e}`);
    }
  }

  private assertFfmpeg(): void {
    if (!this.ffmpegAvailable) {
      throw new Error(
        'ffmpeg is not installed on the server (brew install ffmpeg)',
      );
    }
  }
}
