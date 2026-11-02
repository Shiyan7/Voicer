import { readFile } from 'fs/promises';
import { Injectable, Logger } from '@nestjs/common';
import {
  Deepgram,
  DeepgramClient,
  ListenV1ResponseResultsUtterancesItem,
} from '@deepgram/sdk';
import { TranscribedSegment } from './transcription.types';

const TRANSCRIBE_MODEL = 'nova-3';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(private readonly client: DeepgramClient) {}

  async transcribeAudio(filePath: string): Promise<TranscribedSegment[]> {
    this.logger.log(
      `Transcribing ${filePath} with Deepgram ${TRANSCRIBE_MODEL}`,
    );

    const audio = await readFile(filePath);
    const response = await this.client.listen.v1.media.transcribeFile(audio, {
      model: TRANSCRIBE_MODEL,
      diarize: true,
      utterances: true,
      punctuate: true,
      smart_format: true,
      detect_language: true,
    });

    return this.getUtterances(response).map((utterance) =>
      this.toSegment(utterance),
    );
  }

  private getUtterances(
    response: Deepgram.listen.v1.MediaTranscribeResponse,
  ): ListenV1ResponseResultsUtterancesItem[] {
    if (!('results' in response)) return [];
    return response.results.utterances ?? [];
  }

  private toSegment(
    utterance: ListenV1ResponseResultsUtterancesItem,
  ): TranscribedSegment {
    return {
      speakerIndex: utterance.speaker ?? 0,
      startMs: Math.round((utterance.start ?? 0) * 1000),
      endMs: Math.round((utterance.end ?? 0) * 1000),
      text: (utterance.transcript ?? '').trim(),
    };
  }
}
