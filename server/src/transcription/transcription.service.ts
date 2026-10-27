import { readFile } from 'fs/promises';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeepgramClient } from '@deepgram/sdk';
import { TranscribedSegment } from './transcription.types';

const TRANSCRIBE_MODEL = 'nova-3';
const MAX_RETRIES = 3;

interface DeepgramUtterance {
  speaker?: number;
  start: number;
  end: number;
  transcript: string;
}

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);
  private readonly client: DeepgramClient;

  constructor(configService: ConfigService) {
    this.client = new DeepgramClient({
      apiKey: configService.get<string>('DEEPGRAM_API_KEY'),
      timeoutInSeconds: 1800,
      maxRetries: MAX_RETRIES,
    });
  }

  async transcribeAudio(filePath: string): Promise<TranscribedSegment[]> {
    this.logger.log(
      `Transcribing ${filePath} with Deepgram ${TRANSCRIBE_MODEL}`,
    );

    const audio = await readFile(filePath);
    const response = await this.client.listen.v1.media.transcribeFile(
      audio,
      {
        model: TRANSCRIBE_MODEL,
        diarize: true,
        utterances: true,
        punctuate: true,
        smart_format: true,
        detect_language: true,
      },
      {
        timeoutInSeconds: 1800,
      },
    );

    const transcription = response as unknown as {
      results?: { utterances?: DeepgramUtterance[] };
    };

    return (transcription.results?.utterances ?? []).map((utterance) =>
      this.toSegment(utterance),
    );
  }

  private toSegment(utterance: DeepgramUtterance): TranscribedSegment {
    return {
      speakerIndex: utterance.speaker ?? 0,
      startMs: Math.round(utterance.start * 1000),
      endMs: Math.round(utterance.end * 1000),
      text: utterance.transcript.trim(),
    };
  }
}
