import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { basename } from 'path';
import { DataSource } from 'typeorm';
import {
  TranscriptSegmentEntity,
  TranscriptSpeaker,
} from '../meetings/transcript-segment.entity';
import { AudioChunk } from './audio.service';
import { fetchWithRetry } from './fetch-retry';
import {
  ChannelSegment,
  RawWhisperSegment,
  TranscribedChunk,
  collectChannelSegments,
  mergeChannels,
} from './transcript-merge';

const GROQ_TRANSCRIPTIONS_URL =
  'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_MODEL = 'whisper-large-v3-turbo';

export type TranscriptSegmentDraft = ChannelSegment<TranscriptSpeaker>;

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Transcribes both channels chunk by chunk, merges them into a single
   * timeline and (idempotently) replaces the meeting's transcript segments.
   */
  async transcribeAndSave(
    meetingId: string,
    leftChunks: AudioChunk[],
    rightChunks: AudioChunk[],
  ): Promise<TranscriptSegmentDraft[]> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not set');
    }

    const meSegments = collectChannelSegments(
      await this.transcribeChunks(leftChunks, apiKey),
      TranscriptSpeaker.ME,
    );
    const otherSegments = collectChannelSegments(
      await this.transcribeChunks(rightChunks, apiKey),
      TranscriptSpeaker.OTHER,
    );

    const merged = mergeChannels(meSegments, otherSegments);

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(TranscriptSegmentEntity, { meetingId });

      if (merged.length > 0) {
        const rows = merged.map((segment) =>
          manager.create(TranscriptSegmentEntity, { ...segment, meetingId }),
        );
        await manager.save(rows, { chunk: 500 });
      }
    });

    this.logger.log(
      `Meeting ${meetingId}: saved ${merged.length} transcript segments`,
    );

    return merged;
  }

  private async transcribeChunks(
    chunks: AudioChunk[],
    apiKey: string,
  ): Promise<TranscribedChunk[]> {
    const result: TranscribedChunk[] = [];

    for (const chunk of chunks) {
      const segments = await this.transcribeFile(chunk.path, apiKey);
      result.push({ offsetMs: chunk.offsetMs, segments });
    }

    return result;
  }

  private async transcribeFile(
    path: string,
    apiKey: string,
  ): Promise<RawWhisperSegment[]> {
    const buffer = await readFile(path);

    const form = new FormData();
    form.append(
      'file',
      new Blob([new Uint8Array(buffer)], { type: 'audio/flac' }),
      basename(path),
    );
    form.append('model', GROQ_MODEL);
    form.append('response_format', 'verbose_json');
    // No `language` param — Whisper auto-detects it.

    const response = await fetchWithRetry(GROQ_TRANSCRIPTIONS_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    const payload = (await response.json()) as {
      segments?: RawWhisperSegment[];
    };

    return payload.segments ?? [];
  }
}
